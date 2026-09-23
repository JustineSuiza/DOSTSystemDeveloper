-- DOST System Database Schema
-- Created: 2026-06-14
-- All tables for the DOST Project Management System

-- ==========================================
-- Main Tables
-- ==========================================

-- Projects Table (Core Project Data)
CREATE TABLE projects_tbl (
    id INT(200) AUTO_INCREMENT PRIMARY KEY,
    projectCode VARCHAR(200),
    programCode VARCHAR(200),
    ISP VARCHAR(200),
    programTitle TEXT(9999),
    projectTitle TEXT(9999),
    responsiblePerson VARCHAR(200),
    funding VARCHAR(200),
    implementingAgency VARCHAR(200),
    programLeader VARCHAR(200),
    projectLeader VARCHAR(200),
    emailAddress VARCHAR(200),
    contactNumber VARCHAR(200),
    postalAddress VARCHAR(200),
    cooperatingAgency VARCHAR(200),
    originalStart VARCHAR(200),
    originalEnd VARCHAR(200),
    changeStart VARCHAR(200),
    changeImplementationDate VARCHAR(200),
    firstExtension VARCHAR(200),
    secondExtension VARCHAR(200),
    objectives TEXT(9999),
    description TEXT(9999),
    deliverables TEXT(9999),
    beneficiaries TEXT(9999),
    status VARCHAR(200),
    remarks VARCHAR(200),
    projectAccomplishment TEXT(9999) NULL,
    dcY1Approval VARCHAR(200),
    gcY1Approval VARCHAR(200),
    execomY1Approval VARCHAR(200),
    dcY2Renewal VARCHAR(200),
    gcY2Renewal VARCHAR(200),
    execomY2Renewal VARCHAR(200),
    dcY3Renewal VARCHAR(200),
    gcY3Renewal VARCHAR(200),
    execomY3Renewal VARCHAR(200),
    inceptionMeeting VARCHAR(200),
    mande VARCHAR(200),
    y1BudgetRealignment VARCHAR(200),
    y2BudgetRealignment VARCHAR(200),
    y3BudgetRealignment VARCHAR(200),
    programReview VARCHAR(200),
    terminalReview VARCHAR(200),
    submissionTerminal VARCHAR(200),
    created_by VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proposals Table
CREATE TABLE proposals_tbl (
    id INT(200) AUTO_INCREMENT PRIMARY KEY,
    ISP VARCHAR(200),
    programTitle VARCHAR(9999),
    projectTitle TEXT(9999),
    responsiblePerson TEXT(200),
    implementingAgency VARCHAR(200),
    programLeader VARCHAR(200),
    leadTRD VARCHAR(200),
    funding VARCHAR(200),
    quarter VARCHAR(200),
    date VARCHAR(200),
    remarks VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Budget Table
CREATE TABLE budget_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    year INT(4),
    amount DECIMAL(12,2),
    totalBudget DECIMAL(12,2),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Table
CREATE TABLE user (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(200),
    last_name VARCHAR(200),
    password VARCHAR(200),
    email VARCHAR(200),
    user_lvl VARCHAR(200),
    reset_token VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample user accounts (imported from existing dump)
-- Passwords are bcrypt hashes (password_hash/PASSWORD_DEFAULT).
-- Plaintext equivalents: admin, sample, mike1, 1234566, Test123456
INSERT INTO `user` (`id`, `first_name`, `last_name`, `password`, `email`, `user_lvl`, `reset_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Joshua', 'Barte', '$2y$10$HqUW8H0MHBk0EnQqgHovu.U69njhStKKw3rrornrBMg3KgSr1HiNS', 'bartejoshua190@gmail.com', '0', '', '2024-05-09 09:29:55', '2024-05-14 12:03:24', ''),
(2, 'sample', 'sample', '$2y$10$PWoIIj1cGT16c0gdKhDaCOtbF/QOENlHo4d6egkL08Fvws7/8p8U.', 'sample@gmail.com', '1', '', '2024-05-15 09:58:24', '2024-05-15 09:59:53', ''),
(4, 'Mike', 'Zayas', '$2y$10$QEQ3saVstHDdk6jNr1Ui1uNLO4Vs7kYSaM30yvI4MIp.nwpq69E2.', 'mike1@gmail.com', '1', '', '2026-05-25 19:51:51', '2026-05-25 20:00:17', ''),
(6, 'Justine', 'Suiza', '$2y$10$/OYxOmB2fvfIvkUGuJf/JeFa5VzzzmpHR.FlJAoBoUTqOKy8LfZYK', 'justinesuiza1@gmail.com', '1', '', '2026-05-25 20:02:43', '2026-05-25 20:03:06', ''),
(7, 'Test', 'User', '$2y$10$Y8vfshaES07o9gDl7nCtDOr8wpzZrM3NShb.i2RzDSs67VYv8s84m', 'test@test.com', '2', '', '2026-06-04 09:23:06', '2026-06-04 09:23:06', '');

-- Releases Table
CREATE TABLE releases_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    programmedAmount DECIMAL(12,2),
    regionIA VARCHAR(200),
    particulars VARCHAR(200),
    dvNo VARCHAR(200),
    dateOfRelease VARCHAR(200),
    month VARCHAR(200),
    actualRelease DECIMAL(12,2),
    remarksReleases VARCHAR(200),
    statusReleases VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Counterpart Fund Table
CREATE TABLE counterpartFund_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    year INT(4),
    amount DECIMAL(12,2),
    totalFund DECIMAL(12,2),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gaps Table
CREATE TABLE gaps_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11) DEFAULT NULL,
    phase VARCHAR(200),
    hatchery TEXT(9999),
    nursery TEXT(9999),
    growOut TEXT(9999),
    postHarvest TEXT(9999),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Files Upload Table
CREATE TABLE files_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    implementationFilename VARCHAR(200),
    implementationFilepath VARCHAR(200),
    extensionFilename VARCHAR(200),
    extensionFilepath VARCHAR(200),
    realignmentFilename VARCHAR(200),
    realignmentFilepath VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6PS Performance Table
CREATE TABLE sixPS_tbl (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    year INT(4),
    targetPublication TEXT(1000),
    actualaccomplishmentPeer TEXT(9999),
    actualaccomplishmentJournal TEXT(9999),
    actualaccomplishmentPresented TEXT(9999),
    details TEXT(9999),
    actualaccomplishmentIEC TEXT(9999),
    targetProduct TEXT(9999),
    techName TEXT(9999),
    techDescription TEXT(9999),
    targetPatent TEXT(9999),
    agency TEXT(9999),
    techNamePro TEXT(9999),
    statusSix TEXT(9999),
    dost TEXT(9999),
    patentNumber TEXT(9999),
    targetPeople TEXT(9999),
    namesBS TEXT(9999),
    namesMS TEXT(9999),
    namesPhD TEXT(9999),
    targetPlaces TEXT(9999),
    cooperators TEXT(9999),
    international TEXT(9999),
    privateSixPS TEXT(9999),
    targetPolicy TEXT(9999),
    policyRecommendation TEXT(9999),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Future S&T Directions Table
CREATE TABLE future_sandt_directions_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    industrySituation TEXT,
    goals TEXT,
    bannerProgram VARCHAR(255),
    programProject TEXT,
    year INT(4),
    budget VARCHAR(255),
    pillar VARCHAR(255),
    strategy TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    deleted_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indirect Cost Summary Table
CREATE TABLE indirect_cost_summary_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    item VARCHAR(500) NOT NULL,
    totalReleases DECIMAL(15,2) DEFAULT 0,
    totalObligation DECIMAL(15,2) DEFAULT 0,
    runningBalance DECIMAL(15,2) DEFAULT 0,
    forPayment DECIMAL(15,2) DEFAULT 0,
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Disbursement Voucher Table (detailed)

CREATE TABLE disbursement_voucher_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    indirect_cost_id INT(11) UNSIGNED NOT NULL,
    project_id INT(200) DEFAULT NULL,
    dv_number VARCHAR(200),
    dv_date DATETIME DEFAULT NULL,
    reference_no VARCHAR(200) DEFAULT NULL,
    payee VARCHAR(200) DEFAULT NULL,
    item_description TEXT DEFAULT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(100) DEFAULT 'draft',
    prepared_by VARCHAR(200) DEFAULT NULL,
    approved_by VARCHAR(200) DEFAULT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (indirect_cost_id) REFERENCES indirect_cost_summary_tbl(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for voucher search
CREATE INDEX idx_voucher_dv_number ON disbursement_voucher_tbl(dv_number);
CREATE INDEX idx_voucher_project ON disbursement_voucher_tbl(project_id);

-- ==========================================
-- Archive Tables (Historical Records)
-- ==========================================

-- Archive Projects Table
CREATE TABLE archive_projects_tbl (
    id INT(200) AUTO_INCREMENT PRIMARY KEY,
    ISP VARCHAR(200),
    programTitle TEXT(9999),
    projectTitle TEXT(9999),
    responsiblePerson VARCHAR(200),
    funding VARCHAR(200),
    implementingAgency VARCHAR(200),
    programLeader VARCHAR(200),
    emailAddress VARCHAR(200),
    contactNumber VARCHAR(200),
    postalAddress VARCHAR(200),
    cooperatingAgency VARCHAR(200),
    originalStart VARCHAR(200),
    originalEnd VARCHAR(200),
    changeStart VARCHAR(200),
    changeImplementationDate VARCHAR(200),
    firstExtension VARCHAR(200),
    secondExtension VARCHAR(200),
    objectives TEXT(9999),
    description TEXT(9999),
    deliverables TEXT(9999),
    beneficiaries TEXT(9999),
    status VARCHAR(200),
    remarks VARCHAR(200),
    dcY1Approval VARCHAR(200),
    gcY1Approval VARCHAR(200),
    execomY1Approval VARCHAR(200),
    dcY2Renewal VARCHAR(200),
    gcY2Renewal VARCHAR(200),
    execomY2Renewal VARCHAR(200),
    dcY3Renewal VARCHAR(200),
    gcY3Renewal VARCHAR(200),
    execomY3Renewal VARCHAR(200),
    inceptionMeeting VARCHAR(200),
    mande VARCHAR(200),
    y1BudgetRealignment VARCHAR(200),
    y2BudgetRealignment VARCHAR(200),
    y3BudgetRealignment VARCHAR(200),
    programReview VARCHAR(200),
    terminalReview VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Archive Proposals Table
CREATE TABLE archive_proposals_tbl (
    id INT(200) AUTO_INCREMENT PRIMARY KEY,
    ISP VARCHAR(200),
    programTitle TEXT(9999),
    projectTitle TEXT(9999),
    responsiblePerson VARCHAR(200),
    implementingAgency VARCHAR(200),
    leadTRD VARCHAR(200),
    funding VARCHAR(200),
    quarter VARCHAR(200),
    date VARCHAR(200),
    remarks VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Archive Budget Table
CREATE TABLE archive_budget_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    year INT(4),
    amount DECIMAL(10,2),
    totalBudget DECIMAL(10,2),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES archive_projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Archive Releases Table
CREATE TABLE archive_releases_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    programmedAmount DECIMAL(10,2),
    regionIA VARCHAR(200),
    particulars VARCHAR(200),
    dvNo VARCHAR(200),
    dateOfRelease VARCHAR(200),
    month VARCHAR(200),
    actualRelease VARCHAR(200),
    remarksReleases VARCHAR(200),
    statusReleases VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES archive_projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Archive Counterpart Fund Table
CREATE TABLE archive_counterpartFund_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11),
    year INT(4),
    amount DECIMAL(10,2),
    totalFund DECIMAL(10,2),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES archive_projects_tbl(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Indexes for Performance
-- ==========================================

CREATE INDEX idx_projects_status ON projects_tbl(status);
CREATE INDEX idx_projects_isp ON projects_tbl(ISP);
CREATE INDEX idx_projects_funding ON projects_tbl(funding);
CREATE INDEX idx_budget_project ON budget_tbl(project_id);
CREATE INDEX idx_budget_year ON budget_tbl(year);
CREATE INDEX idx_releases_project ON releases_tbl(project_id);
CREATE INDEX idx_releases_month ON releases_tbl(month);
CREATE INDEX idx_counterpart_project ON counterpartFund_tbl(project_id);
CREATE INDEX idx_counterpart_year ON counterpartFund_tbl(year);
CREATE INDEX idx_sixps_project ON sixPS_tbl(project_id);
CREATE INDEX idx_sixps_year ON sixPS_tbl(year);
CREATE INDEX idx_user_email ON user(email);

-- ==========================================
-- Proposal Type Tables
-- Separate tables for Concept, Fullblown, and IDD Proposals
-- ==========================================

CREATE TABLE concept_proposals_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11) DEFAULT NULL,
    ISP VARCHAR(200),
    programTitle TEXT(9999),
    projectTitle TEXT(9999),
    responsiblePerson VARCHAR(200),
    implementingAgency VARCHAR(200),
    programLeader VARCHAR(200),
    leadTRD VARCHAR(200),
    funding VARCHAR(200),
    quarter VARCHAR(50),
    proposal_date VARCHAR(200),
    proposal_file VARCHAR(255),
    status VARCHAR(100),
    remarks VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fullblown_proposals_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11) DEFAULT NULL,
    ISP VARCHAR(200),
    programTitle TEXT(9999),
    projectTitle TEXT(9999),
    responsiblePerson VARCHAR(200),
    implementingAgency VARCHAR(200),
    programLeader VARCHAR(200),
    leadTRD VARCHAR(200),
    funding VARCHAR(200),
    quarter VARCHAR(50),
    proposal_date VARCHAR(200),
    proposal_file VARCHAR(255),
    status VARCHAR(100),
    remarks VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE idd_proposals_tbl (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT(11) DEFAULT NULL,
    ISP VARCHAR(200),
    programTitle TEXT(9999),
    projectTitle TEXT(9999),
    responsiblePerson VARCHAR(200),
    implementingAgency VARCHAR(200),
    programLeader VARCHAR(200),
    leadTRD VARCHAR(200),
    funding VARCHAR(200),
    quarter VARCHAR(50),
    proposal_date VARCHAR(200),
    proposal_file VARCHAR(255),
    status VARCHAR(100),
    remarks VARCHAR(200),
    created_at VARCHAR(200),
    updated_at VARCHAR(200),
    deleted_at VARCHAR(200),
    FOREIGN KEY (project_id) REFERENCES projects_tbl(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for the new proposal tables
CREATE INDEX idx_concept_proposals_project ON concept_proposals_tbl(project_id);
CREATE INDEX idx_fullblown_proposals_project ON fullblown_proposals_tbl(project_id);
CREATE INDEX idx_idd_proposals_project ON idd_proposals_tbl(project_id);
