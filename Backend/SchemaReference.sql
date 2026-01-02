// menues
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  position INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);


// pages 
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  menu_id INT REFERENCES menus(id) ON DELETE SET NULL,
  parent_id INT REFERENCES pages(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  position INT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('draft','published')) DEFAULT 'draft',
  seo_meta JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
 
// pages sections
CREATE TABLE page_sections (
  id SERIAL PRIMARY KEY,
  page_id INT REFERENCES pages(id) ON DELETE CASCADE,
  title VARCHAR(200),
  position INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

//content blocks
CREATE TABLE content_blocks (
  id SERIAL PRIMARY KEY,
  section_id INT REFERENCES page_sections(id) ON DELETE CASCADE,
  block_type VARCHAR(30) CHECK (
    block_type IN ('text','image','list','html')
  ),
  content JSONB NOT NULL,
  position INT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

//designations
CREATE TABLE designations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) UNIQUE NOT NULL,
  priority INT NOT NULL
);

//departments
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
);

//faculty
CREATE TABLE directorates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  designation_id INT REFERENCES designations(id),
  department_id INT REFERENCES departments(id),
  photo_url TEXT,
  profile JSONB,
  is_active BOOLEAN DEFAULT true
);

//faculty pages
CREATE TABLE page_faculty (
  page_id INT REFERENCES pages(id) ON DELETE CASCADE,
  directorates_id INT REFERENCES directorates(id) ON DELETE CASCADE,
  position INT,
  PRIMARY KEY (page_id, directorates_id)
);

//notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  link TEXT,
  category VARCHAR(50),
  priority INT DEFAULT 0,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  is_scrolling BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

//media
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  type VARCHAR(30),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT NOW()
);

//admin
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password_hash TEXT,
);
