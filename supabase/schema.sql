-- All WashU CSE courses available in the catalog
create table courses (
  id serial primary key,
  code text not null unique,       -- e.g. "CSE 4202"
  name text not null,              -- e.g. "Operating Systems Organization"
  credits numeric(3,1) not null,
  description text,
  department text not null default 'CSE'
);

-- Requirement categories for the CS major and Finance minor
create table requirement_categories (
  id serial primary key,
  name text not null,              -- e.g. "CS Core", "Systems", "Finance Minor"
  program text not null,           -- "CS_MAJOR" | "FINANCE_MINOR"
  credits_required numeric(4,1),
  notes text
);

-- Individual course requirements (specific courses that must be taken)
create table requirements (
  id serial primary key,
  category_id integer references requirement_categories(id),
  course_code text,                -- null means "choose from electives"
  course_name text,
  credits numeric(3,1) not null,
  is_required boolean not null default true,
  elective_group text             -- groups elective options together (e.g. "SYSTEMS_ELECTIVE")
);

-- Semesters (past and future)
create table semesters (
  id serial primary key,
  term text not null,             -- "Fall" | "Spring" | "Summer"
  year integer not null,
  is_completed boolean not null default false,
  unique(term, year)
);

-- Courses Bryan has taken or plans to take
create table user_courses (
  id serial primary key,
  semester_id integer references semesters(id),
  course_code text not null,
  course_name text not null,
  credits numeric(3,1) not null,
  grade text,                     -- null if planned
  grade_points numeric(3,1),
  is_transfer boolean not null default false,
  is_planned boolean not null default false
);
