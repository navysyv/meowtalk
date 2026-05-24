
-- 1) Table
create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  last_grant_date date not null default current_date,
  lifetime_used integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_credits enable row level security;

create policy "Users read own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

create policy "Service role manages credits"
  on public.user_credits for all
  using (auth.role() = 'service_role');

-- 2) Helper: ensure row & apply daily refill. Returns the row.
create or replace function public.ensure_user_credits(_user uuid)
returns public.user_credits
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.user_credits;
  premium boolean;
  daily_grant integer;
begin
  if _user is null then
    raise exception 'user is required';
  end if;

  premium := public.has_active_subscription(_user, 'live')
          or public.has_active_subscription(_user, 'sandbox');
  daily_grant := case when premium then 300 else 10 end;

  select * into rec from public.user_credits where user_id = _user;

  if not found then
    insert into public.user_credits (user_id, balance, last_grant_date)
    values (_user, daily_grant, current_date)
    returning * into rec;
    return rec;
  end if;

  if rec.last_grant_date < current_date then
    update public.user_credits
       set balance = greatest(balance, 0) + daily_grant,
           last_grant_date = current_date,
           updated_at = now()
     where user_id = _user
    returning * into rec;
  end if;

  return rec;
end;
$$;

-- 3) Spend credits atomically
create or replace function public.consume_credits(_user uuid, _cost integer)
returns table(ok boolean, balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.user_credits;
begin
  if _cost <= 0 then
    rec := public.ensure_user_credits(_user);
    return query select true, rec.balance;
    return;
  end if;

  rec := public.ensure_user_credits(_user);

  if rec.balance < _cost then
    return query select false, rec.balance;
    return;
  end if;

  update public.user_credits
     set balance = balance - _cost,
         lifetime_used = lifetime_used + _cost,
         updated_at = now()
   where user_id = _user
  returning * into rec;

  return query select true, rec.balance;
end;
$$;
