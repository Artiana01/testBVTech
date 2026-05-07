import fs from 'fs';
import path from 'path';

export async function globalSetup() {
  console.log('🚀 Initialisation globale - BV Portage Freelance Tests');

  const envFile = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envFile)) {
    console.warn('⚠️ Fichier .env manquant. Utilisation de .env.example');
    const exampleEnvFile = path.join(__dirname, '..', '.env.example');
    fs.copyFileSync(exampleEnvFile, envFile);
  }

  console.log('✅ Initialisation complétée');
}
