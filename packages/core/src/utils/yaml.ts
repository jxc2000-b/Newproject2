import yaml from 'js-yaml';
import type { AlgorithmConfig } from '../types/algorithm.js';

/**
 * Parse YAML algorithm configuration
 */
export function parseAlgorithmConfig(yamlString: string): AlgorithmConfig {
  try {
    const config = yaml.load(yamlString) as AlgorithmConfig;
    
    // Validate version
    if (!config.version) {
      throw new Error('Algorithm config must include a version field');
    }

    // Validate required fields
    if (!config.name) {
      throw new Error('Algorithm config must include a name');
    }

    if (!config.description) {
      throw new Error('Algorithm config must include a description');
    }

    return config;
  } catch (error) {
    throw new Error(`Failed to parse algorithm config: ${error}`);
  }
}

/**
 * Serialize algorithm configuration to YAML
 */
export function serializeAlgorithmConfig(config: AlgorithmConfig): string {
  try {
    return yaml.dump(config, {
      indent: 2,
      lineWidth: 100,
      noRefs: true
    });
  } catch (error) {
    throw new Error(`Failed to serialize algorithm config: ${error}`);
  }
}

/**
 * Validate algorithm configuration
 */
export function validateAlgorithmConfig(config: AlgorithmConfig): boolean | string {
  // Check version
  if (!config.version || !config.version.match(/^\d+\.\d+\.\d+$/)) {
    return 'Invalid version format. Expected semver (e.g., "0.1.0")';
  }

  // Check required fields
  if (!config.name || config.name.trim().length === 0) {
    return 'Name is required';
  }

  if (!config.description || config.description.trim().length === 0) {
    return 'Description is required';
  }

  // Validate filters
  if (config.filters) {
    for (const filter of config.filters) {
      if (!['source', 'keyword', 'contentType', 'age'].includes(filter.type)) {
        return `Invalid filter type: ${filter.type}`;
      }
      if (!['include', 'exclude'].includes(filter.mode)) {
        return `Invalid filter mode: ${filter.mode}`;
      }
    }
  }

  // Validate boosters
  if (config.boosters) {
    for (const booster of config.boosters) {
      if (!['recency', 'engagement', 'sourceAffinity'].includes(booster.type)) {
        return `Invalid booster type: ${booster.type}`;
      }
      if (typeof booster.weight !== 'number' || booster.weight < 0) {
        return 'Booster weight must be a positive number';
      }
    }
  }

  // Validate sort
  if (config.sort) {
    if (!['chronological', 'score', 'random'].includes(config.sort.type)) {
      return `Invalid sort type: ${config.sort.type}`;
    }
    if (!['asc', 'desc'].includes(config.sort.direction)) {
      return `Invalid sort direction: ${config.sort.direction}`;
    }
  }

  // Validate limit
  if (config.limit) {
    if (typeof config.limit.maxItems !== 'number' || config.limit.maxItems <= 0) {
      return 'Limit maxItems must be a positive number';
    }
  }

  return true;
}
