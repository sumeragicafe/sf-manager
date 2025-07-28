-- Animal table
CREATE TABLE IF NOT EXISTS animals (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INT COMMENT 'Age in months',
    gender ENUM('male', 'female') NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    color VARCHAR(100),
    description TEXT,
    health_status VARCHAR(255),
    is_vaccinated BOOLEAN DEFAULT FALSE NOT NULL,
    is_castrated BOOLEAN DEFAULT FALSE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    adoption_fee DECIMAL(10, 2),
    image_url VARCHAR(500),
    rescue_date DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Adoption requests table
CREATE TABLE IF NOT EXISTS adoption_requests (
    id VARCHAR(36) PRIMARY KEY,
    responsible_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    animal_id VARCHAR(36) NOT NULL,
    terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending' NOT NULL,
    submitted_at DATETIME,
    reviewed_at DATETIME,
    reviewed_by VARCHAR(36),
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_animals_available ON animals(is_available);
CREATE INDEX idx_animals_species ON animals(species);
CREATE INDEX idx_adoption_requests_status ON adoption_requests(status);
CREATE INDEX idx_adoption_requests_animal ON adoption_requests(animal_id);
CREATE INDEX idx_adoption_requests_submitted ON adoption_requests(submitted_at);

-- Insert sample animals for testing
INSERT INTO animals (id, name, species, breed, age, gender, size, color, description, is_vaccinated, is_castrated, is_available, created_at, updated_at) VALUES
(UUID(), 'Bella', 'dog', 'Labrador Mix', 24, 'female', 'large', 'Golden', 'Cadela muito dócil e carinhosa, ótima com crianças.', TRUE, TRUE, TRUE, NOW(), NOW()),
(UUID(), 'Max', 'dog', 'Vira-lata', 18, 'male', 'medium', 'Preto e Branco', 'Cão brincalhão e protetor, ideal para famílias ativas.', TRUE, FALSE, TRUE, NOW(), NOW()),
(UUID(), 'Luna', 'cat', 'Siamês', 12, 'female', 'small', 'Cinza', 'Gata independente e carinhosa, perfeita para apartamentos.', TRUE, TRUE, TRUE, NOW(), NOW()),
(UUID(), 'Thor', 'dog', 'Pastor Alemão', 36, 'male', 'large', 'Marrom e Preto', 'Cão leal e inteligente, precisa de espaço para exercitar-se.', TRUE, TRUE, TRUE, NOW(), NOW()); 