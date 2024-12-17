const Database = require("./database");
const SparqlClient = require("sparql-client-2");

const endpoint = "https://dbpedia.org/sparql";

class MurderModel {
  constructor() {
    // Gerçek SPARQL endpoint URL’i
    this.db = new Database(endpoint);
    this.client = new SparqlClient(endpoint, {
      defaultParameters: { format: "json" },
    });
  }

  // Tüm cinayet davalarını getiren fonksiyon
  async getMurderCases() {
    const query = `
      SELECT ?case ?caseLabel ?abstract
        WHERE {
          ?case rdf:type dbo:Event ;
                rdfs:label ?caseLabel ;
                dbo:abstract ?abstract .
          FILTER (
            (lang(?caseLabel) = "en" || lang(?caseLabel) = "tr") &&
            (lang(?abstract) = "en" || lang(?abstract) = "tr")
          )
          FILTER (
            CONTAINS(LCASE(?caseLabel), "Crime") || 
            CONTAINS(LCASE(?caseLabel), "crime")
          )
        }
        LIMIT 20
    `;
    try {
      const result = await this.client.query(query).execute();
      // Sonuçları düzenli bir JSON formatında döndür
      return result.results.bindings.map((binding) => ({
        case: binding.case.value,
        label: binding.caseLabel.value,
        abstract: binding.abstract.value,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // Tüm cinayet verilerini getiren fonksiyon
  async getAllMurders() {
    const query = `
        PREFIX ex: <http://example.org/schema#>
        SELECT ?id ?name ?type ?year ?city WHERE {
            ?murder a ex:Murder ;
                    ex:id ?id ;
                    ex:name ?name ;
                    ex:type ?type ;
                    ex:year ?year ;
                    ex:city ?city .
        }
    `;
    try {
      const result = await this.db.query(query);
      return result.results.bindings.map((b) => ({
        id: b.id.value,
        name: b.name.value,
        type: b.type.value,
        year: b.year.value,
        city: b.city.value,
      }));
    } catch (error) {
      console.error("Error fetching all murders:", error);
      throw error;
    }
  }

  // Belirli bir cinayet ID'sine ait veriyi getiren fonksiyon
  async getMurderById(murderId) {
    const query = `
        PREFIX ex: <http://example.org/schema#>
        SELECT ?p ?o WHERE {
            ?murder a ex:Murder ;
                    ex:id "${murderId}" ;
                    ?p ?o .
        }
    `;
    try {
      const result = await this.db.query(query);
      let murderData = {};
      result.results.bindings.forEach((b) => {
        const predicate = b.p.value;
        const object = b.o.value;
        let propName = predicate;
        if (propName.startsWith("http://example.org/schema#")) {
          propName = propName.replace("http://example.org/schema#", "");
        }
        murderData[propName] = object;
      });
      return murderData;
    } catch (error) {
      console.error("Error fetching murder by ID:", error);
      throw error;
    }
  }
}

module.exports = MurderModel;
