/**
 * Composable pour exporter des données en CSV/Excel
 */
export const useExport = () => {
  /**
   * Convertit un tableau d'objets en CSV
   * @param {Array} data - Tableau de données à exporter
   * @param {Array} columns - Configuration des colonnes [{key, label}]
   * @returns {string} - Contenu CSV
   */
  const convertToCSV = (data, columns) => {
    if (!data || data.length === 0) {
      return "";
    }

    // En-têtes CSV
    const headers = columns.map((col) => col.label).join(",");
    
    // Lignes de données
    const rows = data.map((item) => {
      return columns
        .map((col) => {
          let value = col.transform
            ? col.transform(item[col.key], item)
            : item[col.key] || "";
          
          // Échapper les valeurs contenant des virgules ou guillemets
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          
          return value;
        })
        .join(",");
    });

    return [headers, ...rows].join("\n");
  };

  /**
   * Télécharge un fichier CSV
   * @param {string} csvContent - Contenu CSV
   * @param {string} filename - Nom du fichier
   */
  const downloadCSV = (csvContent, filename = "export.csv") => {
    // Vérifier que nous sommes dans le navigateur
    if (typeof window === "undefined" || !document) {
      throw new Error("L'export ne peut être effectué que dans le navigateur");
    }

    if (!csvContent || csvContent.trim().length === 0) {
      throw new Error("Le contenu CSV est vide");
    }

    try {
      // Ajouter BOM pour Excel UTF-8
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      link.style.display = "none";
      document.body.appendChild(link);
      
      // Déclencher le téléchargement
      link.click();
      
      // Attendre un peu avant de supprimer le lien
      setTimeout(() => {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement:", error);
      throw new Error(`Erreur lors du téléchargement: ${error.message}`);
    }
  };

  /**
   * Exporte des données client en CSV
   * @param {Array|Ref} clients - Liste des clients à exporter (peut être une ref)
   * @param {string} filename - Nom du fichier (optionnel)
   */
  const exportClientsToCSV = (clients, filename = null) => {
    // Vérifier que nous sommes dans le navigateur
    if (typeof window === "undefined" || !document) {
      console.error("❌ Export impossible : pas dans le navigateur");
      throw new Error("L'export ne peut être effectué que dans le navigateur");
    }

    // Gérer les refs Vue
    let clientsArray;
    if (clients && typeof clients === 'object' && 'value' in clients) {
      // C'est une ref
      clientsArray = clients.value;
    } else if (Array.isArray(clients)) {
      // C'est déjà un tableau
      clientsArray = clients;
    } else {
      console.error("❌ Format de données invalide:", clients);
      throw new Error("Format de données invalide pour l'export");
    }

    if (!clientsArray || clientsArray.length === 0) {
      console.error("❌ Aucune donnée à exporter");
      throw new Error("Aucune donnée à exporter");
    }

    console.log(`📊 Export de ${clientsArray.length} client(s)...`);

    const columns = [
      { key: "name", label: "Nom du client", transform: (val, item) => {
        // Utiliser la même logique que getClientName
        if (item.name) return item.name;
        if (item.store) return item.store;
        if (item.email) return item.email;
        if (item.admin && item.admin.length > 0 && item.admin[0].name) return item.admin[0].name;
        return "Client inconnu";
      }},
      { key: "email", label: "Email", transform: (val, item) => {
        if (item.email) return item.email;
        if (item.admin && Array.isArray(item.admin) && item.admin.length > 0) {
          const admin = item.admin.find(a => a.role === "admin" && !a.deleted && a.email);
          if (admin?.email) return admin.email;
        }
        return "";
      }},
      { key: "store", label: "Store", transform: (val) => val || "" },
      { key: "admin", label: "Admins", transform: (val, item) => {
        if (item.admin && Array.isArray(item.admin)) {
          return item.admin
            .filter((a) => !a.deleted && a.name)
            .map((a) => a.name)
            .join("; ");
        }
        return "";
      }},
      { key: "status", label: "Statut", transform: (val) => val || "" },
      { key: "joursRestants", label: "Jours restants", transform: (val) => {
        if (val === null || val === undefined) return "";
        return String(val);
      }},
      { key: "abonnement.end", label: "Date de fin", transform: (val, item) => {
        if (item.abonnement?.end) {
          const date = new Date(item.abonnement.end);
          return date.toLocaleDateString("fr-FR");
        }
        return "";
      }},
      { key: "createdAt", label: "Date d'inscription", transform: (val, item) => {
        const dateValue = item.createdAt || val;
        if (dateValue) {
          const date = new Date(dateValue);
          return date.toLocaleDateString("fr-FR");
        }
        return "";
      }},
      { key: "actionRecommandee", label: "Action recommandée", transform: (val) => val || "" },
      { key: "currency", label: "Devise", transform: (val) => val || "" },
      { key: "factures", label: "Nombre de factures", transform: (val) => val || 0 },
      { key: "transactions", label: "Nombre de transactions", transform: (val) => val || 0 },
      { key: "impayees", label: "Factures impayées", transform: (val) => val || 0 },
    ];

    try {
      const csvContent = convertToCSV(clientsArray, columns);
      const exportFilename = filename || `clients_export_${new Date().toISOString().split("T")[0]}.csv`;
      
      if (!csvContent || csvContent.trim().length === 0) {
        console.error("❌ Le contenu CSV est vide");
        throw new Error("Le contenu CSV est vide");
      }
      
      downloadCSV(csvContent, exportFilename);
      console.log(`✅ Export réussi : ${exportFilename}`);
    } catch (error) {
      console.error("❌ Erreur lors de la génération du CSV:", error);
      throw error;
    }
  };

  return {
    convertToCSV,
    downloadCSV,
    exportClientsToCSV,
  };
};

