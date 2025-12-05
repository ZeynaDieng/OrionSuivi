// Script de test pour vérifier les APIs
import https from 'https';

const API_BASE = 'https://orionsn.com/api/v1';

// Fonction pour faire une requête HTTP
function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${endpoint}`;
    console.log(`\n📡 Test de l'endpoint: ${url}`);
    
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data, // Données brutes si ce n'est pas du JSON
            error: error.message
          });
        }
      });
    }).on('error', (error) => {
      reject({
        error: error.message,
        code: error.code
      });
    });
  });
}

// Test des deux endpoints
async function testAPIs() {
  console.log('🧪 Test des APIs Orion\n');
  console.log('='.repeat(60));

  try {
    // Test 1: /user/
    console.log('\n1️⃣ Test de /user/ (Liste complète des clients)');
    const result1 = await fetchAPI('/user/');
    console.log(`✅ Status: ${result1.status}`);
    console.log(`📦 Type de réponse: ${typeof result1.data}`);
    
    if (result1.data && typeof result1.data === 'object') {
      console.log(`🔑 Clés disponibles: ${Object.keys(result1.data).join(', ')}`);
      
      if (result1.data.liste && Array.isArray(result1.data.liste)) {
        console.log(`✅ Tableau "liste" trouvé avec ${result1.data.liste.length} éléments`);
        if (result1.data.nbr) {
          console.log(`📊 Nombre total déclaré (nbr): ${result1.data.nbr}`);
        }
        if (result1.data.liste.length > 0) {
          console.log(`📝 Premier élément (extrait):`, JSON.stringify(result1.data.liste[0], null, 2).substring(0, 200) + '...');
        }
      } else if (Array.isArray(result1.data)) {
        console.log(`✅ Données reçues directement comme tableau avec ${result1.data.length} éléments`);
      } else {
        console.log(`⚠️ Structure inattendue. Données:`, JSON.stringify(result1.data, null, 2).substring(0, 500));
      }
    } else {
      console.log(`⚠️ Réponse non-JSON ou vide:`, result1.data);
    }

    // Test 2: /users/actifs
    console.log('\n2️⃣ Test de /users/actifs (Clients actifs du mois)');
    const result2 = await fetchAPI('/users/actifs');
    console.log(`✅ Status: ${result2.status}`);
    console.log(`📦 Type de réponse: ${typeof result2.data}`);
    
    if (result2.data && typeof result2.data === 'object') {
      console.log(`🔑 Clés disponibles: ${Object.keys(result2.data).join(', ')}`);
      
      if (result2.data.liste && Array.isArray(result2.data.liste)) {
        console.log(`✅ Tableau "liste" trouvé avec ${result2.data.liste.length} éléments`);
        if (result2.data.nbr) {
          console.log(`📊 Nombre total déclaré (nbr): ${result2.data.nbr}`);
        }
        if (result2.data.liste.length > 0) {
          console.log(`📝 Premier élément (extrait):`, JSON.stringify(result2.data.liste[0], null, 2).substring(0, 200) + '...');
        }
      } else if (Array.isArray(result2.data)) {
        console.log(`✅ Données reçues directement comme tableau avec ${result2.data.length} éléments`);
      } else {
        console.log(`⚠️ Structure inattendue. Données:`, JSON.stringify(result2.data, null, 2).substring(0, 500));
      }
    } else {
      console.log(`⚠️ Réponse non-JSON ou vide:`, result2.data);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Tests terminés avec succès!');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error);
    if (error.error) {
      console.error(`   Message: ${error.error}`);
      if (error.code) {
        console.error(`   Code: ${error.code}`);
      }
    }
  }
}

// Exécuter les tests
testAPIs();

