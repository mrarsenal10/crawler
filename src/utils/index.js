/**
 * Represents a set of hashed URLs.
 */
class HashedURLSet {
  constructor() {
    this.hashedURLs = new Set();
  }

  /**
   * Checks if the set contains a specific URL.
   * @param {string} url - The URL to check.
   * @returns {boolean} - Returns true if the URL is in the set, false otherwise.
   */
  has(url) {
    console.log(this.hashedURLs, url);
    return this.hashedURLs.has(url);
  }

  /**
   * Adds a URL to the set.
   * @param {string} url - The URL to add.
   */
  add(url) {
    this.hashedURLs.add(url);
  }
}

module.exports = new HashedURLSet();
