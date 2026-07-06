# Danubreed — Membership Registration & Admin Platform

A Next.js + Supabase app with two parts:

- **`/register`** — public registration form (no login required)
- **`/admin`** — private dashboard for admins (login required)

## 1. Set up the database

In your Supabase project, open the **SQL Editor** and run the contents of
`supabase-schema.sql` (included in this project) once. It creates the
`members` and `admins` tables, enums, and row-level security policies.

## 2. Create your first admin login

Supabase Auth logs in with **email + password** (not a plain username), so
you'll need an email address for each admin — it doesn't need to be a real
inbox, just a valid-looking address you'll remember, e.g.
`superadmin@danubreed.org`.

1. In Supabase, go to **Authentication → Users → Add user** and create:
   - Email: `superadmin@danubreed.org` (or your choice)
   - Password: `GODISGREAT`
2. Copy that user's **UUID** from the users list.
3. Back in the SQL Editor, run:

```sql
insert into admins (id, full_name, role)
values ('paste-the-uuid-here', 'Super Admin', 'super_admin');
```

To add a **tribe leader** later, repeat the same steps but insert with:

```sql
insert into admins (id, full_name, role, assigned_tribe)
values ('their-uuid', 'Their Name', 'tribe_leader', 'Amber');
```

## 3. Run it locally

```bash
npm install
npm run dev
```

Then visit:
- http://localhost:3000/register — registration form
- http://localhost:3000/admin/login — admin login

Your Supabase URL and anon key are already set in `.env.local`.

## 4. Deploy

Push this project to GitHub and import it into [Vercel](https://vercel.com) —
it will auto-detect Next.js. Add the two environment variables from
`.env.local` in the Vercel project settings (Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Notes

- Tribe leaders only see members in their own tribe, plus the **Unassigned**
  queue (so they can claim people into their tribe). They cannot move
  someone into a different tribe.
- The super admin sees and edits everyone, and is the only one who can
  reassign someone across tribes.
- The Upcoming Birthdays panel looks 30 days ahead and links straight to
  WhatsApp for each person.
- Change the `GODISGREAT` password after first login (Authentication →
  Users → the user → Reset password) since it was shared in plain text.
