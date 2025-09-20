-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "CommunityCategory" AS ENUM ('TECHNOLOGY', 'GAMING', 'CRYPTOCURRENCY', 'NEWS', 'ENTERTAINMENT', 'SPORTS', 'EDUCATION', 'BUSINESS', 'LIFESTYLE', 'SCIENCE', 'ART', 'MUSIC', 'OTHER');

-- CreateEnum
CREATE TYPE "CommunityTheme" AS ENUM ('DEFAULT', 'DEVELOPER', 'GAMER', 'CRYPTO', 'NEWS', 'CREATIVE');

-- CreateEnum
CREATE TYPE "CommunityRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('AMA', 'TOURNAMENT', 'DISCUSSION', 'WORKSHOP', 'MEETUP', 'LIVESTREAM', 'OTHER');

-- CreateEnum
CREATE TYPE "AttendeeStatus" AS ENUM ('GOING', 'INTERESTED', 'NOT_GOING');

-- CreateEnum
CREATE TYPE "CosmeticType" AS ENUM ('THEME', 'BANNER', 'NAMEPLATE', 'PFP_FRAME', 'POST_SKIN', 'COMMENT_FLAIR', 'CHAT_THEME', 'TEXT_DESIGN');

-- CreateEnum
CREATE TYPE "TextDesignCategory" AS ENUM ('CLASSIC', 'MODERN', 'NEON', 'GAMING', 'PROFESSIONAL', 'ARTISTIC', 'ANIMATED', 'GRADIENT');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('VERIFIED', 'PREMIUM', 'SUPPORTER', 'CREATOR');

-- CreateEnum
CREATE TYPE "ThemeCategory" AS ENUM ('CLASSIC', 'NEON', 'MINIMAL', 'GAMING', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('text', 'mood', 'activity');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('DISCORD', 'GITHUB', 'TRADINGVIEW', 'TWITTER', 'TWITCH', 'YOUTUBE', 'STEAM', 'SPOTIFY', 'REDDIT', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('POST', 'COMMENT', 'USER');

-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'VIOLENCE', 'SEXUAL_CONTENT', 'COPYRIGHT', 'MISINFORMATION', 'FAKE_ACCOUNT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportActionType" AS ENUM ('WARNING_ISSUED', 'CONTENT_REMOVED', 'USER_SUSPENDED', 'USER_BANNED', 'NO_ACTION', 'CONTENT_HIDDEN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "bannedAt" TIMESTAMP(3),
ADD COLUMN     "bannedBy" TEXT,
ADD COLUMN     "cozyCoins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "preferredTheme" TEXT DEFAULT 'default',
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "suspendedUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "senderId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "CommunityCategory" NOT NULL,
    "avatar" TEXT,
    "banner" TEXT,
    "theme" "CommunityTheme" NOT NULL DEFAULT 'DEFAULT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityMember" (
    "id" TEXT NOT NULL,
    "role" "CommunityRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "CommunityMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "zoneId" TEXT,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT 'DISCUSSION',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "location" TEXT,
    "maxAttendees" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "CommunityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" TEXT NOT NULL,
    "status" "AttendeeStatus" NOT NULL DEFAULT 'GOING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPinnedPost" (
    "id" TEXT NOT NULL,
    "pinnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinnedById" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "CommunityPinnedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityChatRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "CommunityChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,

    CONSTRAINT "CommunityMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT,
    "permissions" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "communityId" TEXT NOT NULL,

    CONSTRAINT "CommunityZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumBadge" (
    "id" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL DEFAULT 'VERIFIED',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "PremiumBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "colorScheme" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "category" "ThemeCategory" NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTheme" (
    "id" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "UserTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "postId" INTEGER,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoostedPost" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "BoostedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cosmetic" (
    "id" TEXT NOT NULL,
    "type" "CosmeticType" NOT NULL,
    "name" TEXT NOT NULL,
    "preview" TEXT NOT NULL,
    "assetUrl" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cosmetic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCosmetic" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "cosmeticId" TEXT NOT NULL,

    CONSTRAINT "UserCosmetic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTextDesign" (
    "id" TEXT NOT NULL,
    "fontFamily" TEXT,
    "fontSize" TEXT,
    "fontWeight" TEXT,
    "color" TEXT,
    "backgroundColor" TEXT,
    "border" TEXT,
    "borderRadius" TEXT,
    "padding" TEXT,
    "margin" TEXT,
    "textAlign" TEXT,
    "textShadow" TEXT,
    "boxShadow" TEXT,
    "gradient" TEXT,
    "animation" TEXT,
    "customCSS" TEXT,
    "iframeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "PostTextDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentTextDesign" (
    "id" TEXT NOT NULL,
    "fontFamily" TEXT,
    "fontSize" TEXT,
    "fontWeight" TEXT,
    "color" TEXT,
    "backgroundColor" TEXT,
    "border" TEXT,
    "borderRadius" TEXT,
    "padding" TEXT,
    "margin" TEXT,
    "textAlign" TEXT,
    "textShadow" TEXT,
    "boxShadow" TEXT,
    "gradient" TEXT,
    "animation" TEXT,
    "customCSS" TEXT,
    "iframeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentTextDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatTextDesign" (
    "id" TEXT NOT NULL,
    "fontFamily" TEXT,
    "fontSize" TEXT,
    "fontWeight" TEXT,
    "color" TEXT,
    "backgroundColor" TEXT,
    "border" TEXT,
    "borderRadius" TEXT,
    "padding" TEXT,
    "margin" TEXT,
    "textAlign" TEXT,
    "textShadow" TEXT,
    "boxShadow" TEXT,
    "gradient" TEXT,
    "animation" TEXT,
    "customCSS" TEXT,
    "iframeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "ChatTextDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityCosmetic" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityId" TEXT NOT NULL,
    "cosmeticId" TEXT NOT NULL,

    CONSTRAINT "CommunityCosmetic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextDesignTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "TextDesignCategory" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "preview" TEXT NOT NULL,
    "styles" JSONB NOT NULL,
    "iframeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextDesignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTextDesignTemplate" (
    "id" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "UserTextDesignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "StatusType" NOT NULL,
    "text" TEXT,
    "mood" TEXT,
    "activity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalIntegration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "integrationType" "IntegrationType" NOT NULL,
    "externalUserId" TEXT,
    "username" TEXT,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "connectionData" JSONB,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationWebhook" (
    "id" TEXT NOT NULL,
    "integrationType" "IntegrationType" NOT NULL,
    "webhookId" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,
    "secret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "category" "ReportCategory" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reporterId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportAction" (
    "id" TEXT NOT NULL,
    "actionType" "ReportActionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderatorId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "ReportAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CommunityChatRoomToCommunityMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityMember_userId_communityId_key" ON "CommunityMember"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityPost_postId_key" ON "CommunityPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_userId_eventId_key" ON "EventAttendee"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityPinnedPost_communityId_postId_key" ON "CommunityPinnedPost"("communityId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_userId_messageId_emoji_key" ON "MessageReaction"("userId", "messageId", "emoji");

-- CreateIndex
CREATE UNIQUE INDEX "PremiumBadge_userId_key" ON "PremiumBadge"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTheme_userId_themeId_key" ON "UserTheme"("userId", "themeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCosmetic_userId_cosmeticId_key" ON "UserCosmetic"("userId", "cosmeticId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTextDesign_postId_key" ON "PostTextDesign"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentTextDesign_commentId_key" ON "CommentTextDesign"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatTextDesign_messageId_key" ON "ChatTextDesign"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityCosmetic_communityId_cosmeticId_key" ON "CommunityCosmetic"("communityId", "cosmeticId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTextDesignTemplate_userId_templateId_key" ON "UserTextDesignTemplate"("userId", "templateId");

-- CreateIndex
CREATE INDEX "UserStatus_userId_idx" ON "UserStatus"("userId");

-- CreateIndex
CREATE INDEX "UserStatus_expiresAt_idx" ON "UserStatus"("expiresAt");

-- CreateIndex
CREATE INDEX "UserStatus_createdAt_idx" ON "UserStatus"("createdAt");

-- CreateIndex
CREATE INDEX "ExternalIntegration_userId_idx" ON "ExternalIntegration"("userId");

-- CreateIndex
CREATE INDEX "ExternalIntegration_integrationType_idx" ON "ExternalIntegration"("integrationType");

-- CreateIndex
CREATE INDEX "ExternalIntegration_isConnected_idx" ON "ExternalIntegration"("isConnected");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIntegration_userId_integrationType_key" ON "ExternalIntegration"("userId", "integrationType");

-- CreateIndex
CREATE INDEX "IntegrationWebhook_integrationType_idx" ON "IntegrationWebhook"("integrationType");

-- CreateIndex
CREATE INDEX "IntegrationWebhook_isActive_idx" ON "IntegrationWebhook"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationWebhook_integrationType_webhookId_key" ON "IntegrationWebhook"("integrationType", "webhookId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_category_idx" ON "Report"("category");

-- CreateIndex
CREATE INDEX "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportAction_reportId_key" ON "ReportAction"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatParticipants_AB_unique" ON "_ChatParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatParticipants_B_index" ON "_ChatParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityChatRoomToCommunityMember_AB_unique" ON "_CommunityChatRoomToCommunityMember"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityChatRoomToCommunityMember_B_index" ON "_CommunityChatRoomToCommunityMember"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "CommunityZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityEvent" ADD CONSTRAINT "CommunityEvent_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityEvent" ADD CONSTRAINT "CommunityEvent_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CommunityEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPinnedPost" ADD CONSTRAINT "CommunityPinnedPost_pinnedById_fkey" FOREIGN KEY ("pinnedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPinnedPost" ADD CONSTRAINT "CommunityPinnedPost_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPinnedPost" ADD CONSTRAINT "CommunityPinnedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityChatRoom" ADD CONSTRAINT "CommunityChatRoom_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMessage" ADD CONSTRAINT "CommunityMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMessage" ADD CONSTRAINT "CommunityMessage_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "CommunityChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "CommunityMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityZone" ADD CONSTRAINT "CommunityZone_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumBadge" ADD CONSTRAINT "PremiumBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTheme" ADD CONSTRAINT "UserTheme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTheme" ADD CONSTRAINT "UserTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostedPost" ADD CONSTRAINT "BoostedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostedPost" ADD CONSTRAINT "BoostedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCosmetic" ADD CONSTRAINT "UserCosmetic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCosmetic" ADD CONSTRAINT "UserCosmetic_cosmeticId_fkey" FOREIGN KEY ("cosmeticId") REFERENCES "Cosmetic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTextDesign" ADD CONSTRAINT "PostTextDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTextDesign" ADD CONSTRAINT "PostTextDesign_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTextDesign" ADD CONSTRAINT "CommentTextDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTextDesign" ADD CONSTRAINT "CommentTextDesign_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatTextDesign" ADD CONSTRAINT "ChatTextDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatTextDesign" ADD CONSTRAINT "ChatTextDesign_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "CommunityMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityCosmetic" ADD CONSTRAINT "CommunityCosmetic_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityCosmetic" ADD CONSTRAINT "CommunityCosmetic_cosmeticId_fkey" FOREIGN KEY ("cosmeticId") REFERENCES "Cosmetic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTextDesignTemplate" ADD CONSTRAINT "UserTextDesignTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTextDesignTemplate" ADD CONSTRAINT "UserTextDesignTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TextDesignTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStatus" ADD CONSTRAINT "UserStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIntegration" ADD CONSTRAINT "ExternalIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAction" ADD CONSTRAINT "ReportAction_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAction" ADD CONSTRAINT "ReportAction_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatParticipants" ADD CONSTRAINT "_ChatParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatParticipants" ADD CONSTRAINT "_ChatParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityChatRoomToCommunityMember" ADD CONSTRAINT "_CommunityChatRoomToCommunityMember_A_fkey" FOREIGN KEY ("A") REFERENCES "CommunityChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityChatRoomToCommunityMember" ADD CONSTRAINT "_CommunityChatRoomToCommunityMember_B_fkey" FOREIGN KEY ("B") REFERENCES "CommunityMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
