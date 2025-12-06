# Changelog

All notable changes to this project will be documented in this file.

## [0.3.11]

### Fixed
- **Configuration:** Updated `tsconfig.json` to resolve TypeScript module resolution errors in development environments.

## [0.3.10]

### Documentation
- **README:** Updated documentation to fully cover the new Person and Organization Search operations and their available filters.

## [0.3.9]

### Added
- **Organization Search:** Added a new "Search" operation to the Organization resource to allow finding companies.
- **Organization Filters:** Implemented extensive filtering capabilities including:
    - Employee Count and Revenue Ranges
    - Organization Locations (Include/Exclude)
    - Keywords and Name
    - Funding (Latest Amount, Total Amount, Dates)
    - Job Postings (Titles, Locations, Count, Date Ranges)

### Internal
- **Refactoring:** Created `utils.ts` and moved `splitAndTrim` helper function to be shared between Person and Organization logic.

## [0.3.8]

### Added
- **Person Search:** Added a new "Search" operation to the Person resource to allow finding net new people.
- **Search Filters:** Implemented extensive filtering capabilities including:
    - Job Titles and Keywords
    - Person and Organization Locations
    - Seniority Levels
    - Organization Domains and IDs
    - Employee Count and Revenue Ranges
    - Contact Email Status

### Changed
- **Input Parsing:** Enhanced list parameter handling to support semicolon separators and automatically filter out empty or invalid entries for more robust API requests.
- **Compliance:** Sorted multi-select options alphabetically to adhere to n8n node linting standards.