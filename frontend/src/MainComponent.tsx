import styles from "./styles/mainComponent.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useEffect } from "react";
import axios from "axios";

interface Case {
  id: number;
  name: string;
  type: string;
  year: number;
  city: string;
}

interface Cases {
  cases: Case[];
}

interface CaseDetails {
  type: string;
  date: string;
  city: string;
  victim: string;
  murderer: string[];
  accomplice: string[];
  case: string;
  caseStatus: string;
}

const MainComponent = () => {
  const [selectedType, setSelectedType] = useState("Cinayet Türü");
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseDetails | null>(null);

  useEffect(() => {
    const fecthCases = async () => {
      const response = await axios.get<Cases>(
        "http://localhost:3000/api/murders"
      );
      setCases(response.data.cases);
      console.log(cases);
    };

    fecthCases();
  }, []);

  const getCase = async (id: number) => {
    const response = await axios.get<CaseDetails>(
      `http://localhost:3000/api/murders?id=${id}`
    );
    setSelectedCase(response.data);
    console.log(selectedCase);
  };

  return (
    <>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Cinayet Vakaları Bilgi Bankası</h1>
        </div>
        <div className={styles.casesContainer}>
          <div className={styles.filterContainer}>
            <div className={styles.title}>
              <span>Filtreler:</span>
            </div>
            <div className={styles.filters}>
              <Dropdown className={styles.dropdown}>
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  className={styles.customDropdown}
                >
                  {selectedType}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    className={styles.item}
                    onClick={() => setSelectedType("Kadın Cinayeti")}
                  >
                    Kadın Cinayeti
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <input type="text" name="year" id="year" placeholder="Yıl" />
              <input type="text" name="city" id="city" placeholder="Şehir" />
              <div className={styles.queryButton}>
                <button>Sorgula</button>
              </div>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className={styles.name}>Vaka Adı</th>
                  <th className={styles.type}>Vaka Türü</th>
                  <th className={styles.year}>Yıl</th>
                  <th className={styles.city}>Şehir</th>
                  <th className={styles.button}></th>
                </tr>
              </thead>
              <tbody>
                {cases?.map((c) => (
                  <tr>
                    <th>{c.name}</th>
                    <th>{c.type}</th>
                    <th>{c.year}</th>
                    <th>{c.city}</th>
                    <th>
                      <button
                        className={styles.detailsButton}
                        onClick={() => getCase(c.id)}
                      >
                        Detaylar
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.caseDetails}>
          <h2>Vaka Detayları</h2>
          <div className={styles.details}>
            <div className={`${styles.left} ${styles.detailsContainer}`}>
              <div className={styles.type}>
                <span>Type:</span>
                <p>{selectedCase?.type}</p>
              </div>
              <div className={styles.date}>
                <span>Tarih:</span>
                <p>{selectedCase?.date}</p>
              </div>
              <div className={styles.city}>
                <span>Şehir:</span>
                <p>{selectedCase?.city}</p>
              </div>
              <div className={styles.victim}>
                <span>Maktul:</span>
                <p>{selectedCase?.victim}</p>
              </div>
              <div className={styles.suspect}>
                <span>Katil:</span>
                <p>{selectedCase?.murderer.join(", ")}</p>
              </div>
              <div className={styles.accomplice}>
                <span>Ortak:</span>
                <p>{selectedCase?.accomplice.join(", ")}</p>
              </div>
            </div>
            <div className={`${styles.right} ${styles.detailsContainer}`}>
              <div className={styles.case}>
                <span>Dava:</span>
                <p>{selectedCase?.case}</p>
              </div>
              <div className={styles.caseStatus}>
                <span>Dava Durumu:</span>
                <p>{selectedCase?.caseStatus}</p>
                <div className={styles.caseDetailsButton}>
                  <img src="/icons/Eye.png" alt="detail" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainComponent;
