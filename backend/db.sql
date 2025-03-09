-- Create Users Table
CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT NULL,
    avatar_url TEXT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Projects Table
CREATE TABLE projects (
    project_id VARCHAR PRIMARY KEY,
    owner_user_id VARCHAR NOT NULL REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    template_used VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Project Members Table
CREATE TABLE project_members (
    project_id VARCHAR NOT NULL REFERENCES projects(project_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

-- Create Pages Table
CREATE TABLE pages (
    page_id VARCHAR PRIMARY KEY,
    project_id VARCHAR NOT NULL REFERENCES projects(project_id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create UI Elements Table
CREATE TABLE ui_elements (
    element_id VARCHAR PRIMARY KEY,
    project_id VARCHAR NOT NULL REFERENCES projects(project_id),
    page_id VARCHAR NOT NULL REFERENCES pages(page_id),
    element_data JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Comments Table
CREATE TABLE comments (
    comment_id VARCHAR PRIMARY KEY,
    project_id VARCHAR NOT NULL REFERENCES projects(project_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    element_id VARCHAR NOT NULL REFERENCES ui_elements(element_id),
    content TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Version History Table
CREATE TABLE version_history (
    version_id VARCHAR PRIMARY KEY,
    project_id VARCHAR NOT NULL REFERENCES projects(project_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    snapshot JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Assets (Exports) Table
CREATE TABLE assets (
    asset_id VARCHAR PRIMARY KEY,
    project_id VARCHAR NOT NULL REFERENCES projects(project_id),
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('PNG', 'JPG', 'SVG', 'HTML', 'CSS')),
    asset_data TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscriptions Table
CREATE TABLE subscriptions (
    subscription_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(user_id),
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (payment_status IN ('active', 'cancelled')),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed the Users Table
INSERT INTO users (user_id, email, password_hash, name, bio, avatar_url, role, created_at, updated_at) VALUES
('user_1', 'alice@example.com', 'hashed_password_1', 'Alice Johnson', 'UI Designer from NYC', 'https://picsum.photos/seed/alice/200', 'user', NOW(), NOW()),
('user_2', 'bob@example.com', 'hashed_password_2', 'Bob Smith', 'Frontend Developer', 'https://picsum.photos/seed/bob/200', 'admin', NOW(), NOW()),
('user_3', 'charlie@example.com', 'hashed_password_3', 'Charlie Brown', 'Product Manager', 'https://picsum.photos/seed/charlie/200', 'user', NOW(), NOW());

-- Seed the Projects Table
INSERT INTO projects (project_id, owner_user_id, name, description, template_used, created_at, updated_at) VALUES
('project_1', 'user_1', 'E-Commerce UI', 'A sleek UI design for an e-commerce app.', 'template_modern_shop', NOW(), NOW()),
('project_2', 'user_2', 'Dashboard UX', 'A dashboard UI with rich interactions.', 'template_dashboard_v1', NOW(), NOW());

-- Seed the Project Members Table
INSERT INTO project_members (project_id, user_id, role, joined_at) VALUES
('project_1', 'user_1', 'admin', NOW()),
('project_1', 'user_2', 'editor', NOW()),
('project_2', 'user_2', 'admin', NOW()),
('project_2', 'user_3', 'viewer', NOW());

-- Seed the Pages Table
INSERT INTO pages (page_id, project_id, name, created_at, updated_at) VALUES
('page_1', 'project_1', 'Homepage', NOW(), NOW()),
('page_2', 'project_1', 'Product Page', NOW(), NOW()),
('page_3', 'project_2', 'Analytics Dashboard', NOW(), NOW());

-- Seed the UI Elements Table
INSERT INTO ui_elements (element_id, project_id, page_id, element_data, created_at, updated_at) VALUES
('element_1', 'project_1', 'page_1', '{"type": "button", "label": "Buy Now", "color": "blue"}', NOW(), NOW()),
('element_2', 'project_1', 'page_2', '{"type": "image", "src": "https://picsum.photos/seed/product/300"}', NOW(), NOW()),
('element_3', 'project_2', 'page_3', '{"type": "chart", "chartType": "bar", "data": [10, 20, 30]}', NOW(), NOW());

-- Seed the Comments Table
INSERT INTO comments (comment_id, project_id, user_id, element_id, content, resolved, created_at) VALUES
('comment_1', 'project_1', 'user_2', 'element_1', 'Make the button color green instead.', FALSE, NOW()),
('comment_2', 'project_2', 'user_3', 'element_3', 'Consider using a line graph instead.', TRUE, NOW());

-- Seed the Version History Table
INSERT INTO version_history (version_id, project_id, user_id, snapshot, created_at) VALUES
('version_1', 'project_1', 'user_1', '{"page": "Homepage", "elements": [{"type": "button", "label": "Buy Now"}]}', NOW()),
('version_2', 'project_1', 'user_2', '{"page": "Product Page", "elements": [{"type": "image", "src": "https://picsum.photos/300"}]}', NOW());

-- Seed the Assets (Exports) Table
INSERT INTO assets (asset_id, project_id, user_id, asset_type, asset_data, created_at) VALUES
('asset_1', 'project_1', 'user_1', 'PNG', 'https://picsum.photos/seed/export1/500', NOW()),
('asset_2', 'project_2', 'user_2', 'CSS', 'body { background: #fff; }', NOW());

-- Seed the Subscriptions Table
INSERT INTO subscriptions (subscription_id, user_id, plan_type, payment_status, updated_at) VALUES
('sub_1', 'user_1', 'premium', 'active', NOW()),
('sub_2', 'user_2', 'free', 'active', NOW()),
('sub_3', 'user_3', 'premium', 'cancelled', NOW());