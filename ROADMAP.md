# Roadmap

This document outlines future enhancements and features for the feed aggregation platform.

## Future Iterations

### 1. Algorithm Versioning + Fingerprinting

Every algorithm config gets a content-hash ID (like a git commit SHA). When you share an algorithm, you're sharing an immutable snapshot. Edits create new versions. This makes the marketplace trustworthy — you know exactly what you're installing, and it can't change under you.

**Benefits:**
- Immutable algorithm configs ensure reproducibility
- Trust and transparency in the marketplace
- Clear audit trail of algorithm changes
- Easy rollback to previous versions

### 2. "Algorithm Stack" Composition

Instead of one algorithm per feed, let users stack multiple algorithms in a pipeline.

**Example pipeline:**
- **Layer 1:** RSS connector pulls raw items
- **Layer 2:** "Tech News Filter" algorithm removes non-tech content
- **Layer 3:** "Recency Boost" algorithm scores by freshness
- **Layer 4:** "Source Diversity" algorithm ensures variety

Each layer is independently swappable. Encourages small, composable, reusable modules.

**Benefits:**
- Highly modular and composable
- Easier to maintain small, focused algorithms
- Better reusability across feeds
- Community can share specialized pipeline stages

### 3. Dry-Run / Preview Mode

Before committing to an algorithm, users can preview "what would my feed look like with this algorithm?" Side-by-side comparison of current vs. candidate.

**Features:**
- Live preview without affecting actual feed
- A/B comparison view
- Statistics on how algorithm changes affect content distribution
- Easy experimentation without commitment

**Benefits:**
- Lowers the risk of trying community algorithms
- Drives marketplace engagement
- Better user confidence in algorithm selection

### 4. Feed Diff Notifications

"Your algorithm surfaced 12 new items since last check, 3 are high-priority."

Rather than just showing a feed, proactively tell users what changed.

**Features:**
- Smart notifications about feed changes
- Priority-based alerts
- Digest summaries (daily/weekly)
- Change highlighting in feed view

**Benefits:**
- Users stay informed without constant checking
- Better engagement with high-priority content
- Reduced feed fatigue

### 5. Content Regulation Layer

An additional layer on top of the three-layer model for content moderation/regulation.

**Capabilities:**
- User-defined content filters
- Community moderation rules
- Age-appropriate content filtering
- Configurable sensitivity levels
- NSFW/trigger warning systems

**Note:** Deferred for complexity reasons but should be part of the long-term architecture.

### 6. Authentication & Multi-User Support

Move from single-user POC to full multi-user platform.

**Features:**
- User accounts and authentication
- Per-user feed configurations
- Private and shared algorithms
- User preferences and settings
- Social features (following, sharing)

### 7. Mobile App

The eventual target platform for maximum reach and convenience.

**Platforms:**
- iOS native app
- Android native app
- React Native for cross-platform development
- Push notifications
- Offline support

### 8. Twitter/X API Integration

Full Twitter/X integration with proper OAuth flow.

**Note:** API structure placeholder can exist but full auth is complex. This integration will allow:
- Twitter timeline integration
- Tweet embedding in feed
- Twitter-specific algorithm primitives
- Rate limit management

## Technical Debt & Improvements

### Performance Optimization
- Implement caching strategies
- Optimize database queries
- Add pagination for large feeds
- Consider CDN for static assets

### Testing & Quality
- Comprehensive test coverage
- End-to-end testing
- Performance benchmarking
- Load testing for scalability

### Developer Experience
- Improved documentation
- Interactive API documentation
- Connector development toolkit
- Algorithm debugging tools

### Deployment & Operations
- Docker containerization
- CI/CD pipeline
- Monitoring and alerting
- Automated backups

## Protocol Evolution

The plugin SDK is designed to eventually become a protocol. Steps toward formalization:

1. **Specification Documentation**: Extract formal spec from working implementation
2. **Reference Implementation**: Current codebase becomes the reference
3. **Compatibility Testing**: Test suite for protocol compliance
4. **Versioning Strategy**: Semantic versioning for protocol changes
5. **Governance Model**: Community input on protocol evolution
6. **Multi-Implementation**: Encourage alternative implementations in other languages

## Community & Ecosystem

- Algorithm marketplace with ratings and reviews
- Connector directory with certified connectors
- Community forums and support
- Tutorial and learning resources
- Developer grants program
- Annual community conference
