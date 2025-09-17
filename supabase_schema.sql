
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    hashed_password TEXT,
    name VARCHAR(100),
    gender VARCHAR(20),
    birth_date DATE,
    phone_number VARCHAR(20),
    address TEXT,
    bio TEXT,
    website VARCHAR(255),
    relationship_status VARCHAR(50),
    email_verified TIMESTAMP,
    profile_photo TEXT,
    cover_photo TEXT,
    cozy_coins INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    avatar TEXT,
    banner TEXT,
    theme VARCHAR(50) DEFAULT 'DEFAULT',
    is_public BOOLEAN DEFAULT true,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Community members
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, community_id)
);

-- Community zones/channels
CREATE TABLE community_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    emoji VARCHAR(10),
    permissions JSONB DEFAULT '["VIEW", "POST", "COMMENT"]',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table (enhanced)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    zone_id UUID REFERENCES community_zones(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Post likes
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Comment likes
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

-- Follows
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Community events
CREATE TABLE community_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) DEFAULT 'DISCUSSION',
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    location TEXT,
    max_attendees INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Event attendees
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'GOING',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Community chat rooms
CREATE TABLE community_chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Community messages
CREATE TABLE community_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_room_id UUID REFERENCES community_chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Message reactions
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES community_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Activities table (for notifications and activity feed)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    source_id VARCHAR(255),
    target_id VARCHAR(255),
    source_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_notification_active BOOLEAN DEFAULT true,
    is_notification_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Visual media table
CREATE TABLE visual_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'PHOTO',
    file_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Themes table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    color_scheme JSONB,
    is_active BOOLEAN DEFAULT true,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User themes (purchased themes)
CREATE TABLE user_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT false,
    purchased_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, theme_id)
);

-- Premium badges
CREATE TABLE premium_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'VERIFIED',
    purchased_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Tips
CREATE TABLE tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Boosted posts
CREATE TABLE boosted_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- in hours
    amount DECIMAL(10,2) NOT NULL,
    starts_at TIMESTAMP DEFAULT NOW(),
    ends_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cosmetics
CREATE TABLE cosmetics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    preview TEXT,
    asset_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User cosmetics
CREATE TABLE user_cosmetics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cosmetic_id UUID REFERENCES cosmetics(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT false,
    applied_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, cosmetic_id)
);

-- Text design templates
CREATE TABLE text_design_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_free BOOLEAN DEFAULT false,
    preview TEXT,
    styles JSONB,
    iframe_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User text design templates (purchases)
CREATE TABLE user_text_design_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES text_design_templates(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

-- Post text designs
CREATE TABLE post_text_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    font_family VARCHAR(100),
    font_size VARCHAR(20),
    font_weight VARCHAR(20),
    color VARCHAR(20),
    background_color VARCHAR(20),
    border VARCHAR(100),
    border_radius VARCHAR(20),
    padding VARCHAR(50),
    margin VARCHAR(50),
    text_align VARCHAR(20),
    text_shadow VARCHAR(100),
    box_shadow VARCHAR(100),
    gradient VARCHAR(200),
    animation VARCHAR(100),
    custom_css TEXT,
    iframe_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comment text designs
CREATE TABLE comment_text_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    font_family VARCHAR(100),
    font_size VARCHAR(20),
    font_weight VARCHAR(20),
    color VARCHAR(20),
    background_color VARCHAR(20),
    border VARCHAR(100),
    border_radius VARCHAR(20),
    padding VARCHAR(50),
    margin VARCHAR(50),
    text_align VARCHAR(20),
    text_shadow VARCHAR(100),
    box_shadow VARCHAR(100),
    gradient VARCHAR(200),
    animation VARCHAR(100),
    custom_css TEXT,
    iframe_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat text designs
CREATE TABLE chat_text_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_id UUID REFERENCES community_messages(id) ON DELETE CASCADE,
    font_family VARCHAR(100),
    font_size VARCHAR(20),
    font_weight VARCHAR(20),
    color VARCHAR(20),
    background_color VARCHAR(20),
    border VARCHAR(100),
    border_radius VARCHAR(20),
    padding VARCHAR(50),
    margin VARCHAR(50),
    text_align VARCHAR(20),
    text_shadow VARCHAR(100),
    box_shadow VARCHAR(100),
    gradient VARCHAR(200),
    animation VARCHAR(100),
    custom_css TEXT,
    iframe_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Community pinned posts
CREATE TABLE community_pinned_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    pinned_by UUID REFERENCES users(id) ON DELETE CASCADE,
    pinned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(community_id, post_id)
);

-- Integrations table
CREATE TABLE user_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL, -- discord, github, spotify, etc.
    integration_data JSONB, -- store tokens, user IDs, etc.
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chats table (for DMs)
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat participants
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW()
);

-- Direct messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_community_id ON posts(community_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_activities_target_user_id ON activities(target_user_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_user_id ON community_members(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples)
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public communities" ON communities FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create communities" ON communities FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Community creators can update" ON communities FOR UPDATE USING (auth.uid() = creator_id);

-- Functions for real-time features
CREATE OR REPLACE FUNCTION notify_new_activity()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('new_activity', json_build_object(
        'id', NEW.id,
        'type', NEW.type,
        'source_user_id', NEW.source_user_id,
        'target_user_id', NEW.target_user_id,
        'created_at', NEW.created_at
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_notification
    AFTER INSERT ON activities
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_activity();

-- Function to update community member counts
CREATE OR REPLACE FUNCTION update_community_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- This could trigger real-time updates to community stats
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER community_member_stats
    AFTER INSERT OR DELETE ON community_members
    FOR EACH ROW
    EXECUTE FUNCTION update_community_stats();
