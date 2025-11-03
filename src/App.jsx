import { useEffect, useMemo, useState } from "react";
import "./App.css";

const FALLBACK_CONTACTS = [
  { id: 1, name: "Tony Stark", phone: "(555) 000-0001", email: "tony@starkindustries.com", photo: "https://ui-avatars.com/api/?name=Tony+Stark&background=000&color=fff&size=128" },
  { id: 2, name: "Steve Rogers", phone: "(555) 000-0002", email: "steve@avengers.com", photo: "https://ui-avatars.com/api/?name=Steve+Rogers&background=005&color=fff&size=128" },
  { id: 3, name: "Thor Odinson", phone: "(555) 000-0003", email: "thor@asgard.com", photo: "https://ui-avatars.com/api/?name=Thor+Odinson&background=195&color=fff&size=128" },
  { id: 4, name: "Bruce Banner", phone: "(555) 000-0004", email: "bruce@gamma.lab", photo: "https://ui-avatars.com/api/?name=Bruce+Banner&background=228&color=000&size=128" },
  { id: 5, name: "Natasha Romanoff", phone: "(555) 000-0005", email: "natasha@shield.gov", photo: "https://ui-avatars.com/api/?name=Natasha+Romanoff&background=222&color=fff&size=128" },
  { id: 6, name: "Clint Barton", phone: "(555) 000-0006", email: "clint@hawkeye.net", photo: "https://ui-avatars.com/api/?name=Clint+Barton&background=444&color=fff&size=128" },
  { id: 7, name: "Peter Parker", phone: "(555) 000-0007", email: "peter@dailybugle.com", photo: "https://ui-avatars.com/api/?name=Peter+Parker&background=e33&color=fff&size=128" },
  { id: 8, name: "Stephen Strange", phone: "(555) 000-0008", email: "strange@sanctum.com", photo: "https://ui-avatars.com/api/?name=Stephen+Strange&background=3a3&color=fff&size=128" },
  { id: 9, name: "T'Challa", phone: "(555) 000-0009", email: "tchalla@wakanda.gov", photo: "https://ui-avatars.com/api/?name=T'Challa&background=0a0&color=fff&size=128" },
  { id: 10, name: "Carol Danvers", phone: "(555) 000-0010", email: "carol@starforce.mil", photo: "https://ui-avatars.com/api/?name=Carol+Danvers&background=06f&color=fff&size=128" },
];

const App = () => {
    const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  
   

    useEffect(() => {}, []);

        const [query, setQuery] = useState("");

        const [form, setForm] = useState({ name: "", phone: "", email: "", photo: "" });

        // Pagination: show one contact per page
        const [currentPage, setCurrentPage] = useState(1);
        const PER_PAGE = 1;

        const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
  }, [contacts, query]);

    // Recompute total pages and clamp current page when filtered results change
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    useEffect(() => {
        setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
    }, [totalPages]);
    function handleSubmit(e) {
        e.preventDefault();
        // Add contact submission logic here
        if (!form.name || !form.phone) return;
        const id = Date.now();
        // Use provided photo URL if present, otherwise fall back to ui-avatars
        const photo = form.photo
            ? form.photo
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=111&color=fff&size=128`;
        setContacts((s) => [{ id, name: form.name, phone: form.phone, email: form.email, photo }, ...s]);
    // show the newest contact when adding one (page 1)
    setCurrentPage(1);
    setForm({ name: "", phone: "", email: "" });
    }
    return (
        <main className="page" data-testid="page-root">
            <header className="page__header">
                <h1 className="page__title">Marvel Cinematic Phonebook</h1>
                <p className="page__subtitle">Contact Directory of your Favorite Heroes</p>
            </header>

            <section className="search" aria-labelledby="search-heading">
                <h2 id="search-heading">Search SuperHeroes</h2>
                <div className="search__controls">
                    <label htmlFor="search-input">Search</label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Search by Hero name, phone, or email (try 'Tony')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        data-testid="search-input"
                    />
                </div>

                <p className="search__results" data-testid="results-count">
                    Showing {filtered.length}{" "}
                    {filtered.length === 1 ? "result" : "results"}
                    {loading ? " (loading...)" : ""}
                    {error ? ` (error: ${error})` : ""}
                    {"  "}
                    Page {currentPage} of {totalPages}
                </p>
            </section>


            <section className="contacts" aria-labelledby="contacts-heading">
                <h2 id="contacts-heading">Contacts</h2>
                <div className="contacts_grid">
                    {/* only shiw contacts for the current page (PER_PAGE = 1) */}
                    {(() => {
                        const start = (currentPage - 1) * PER_PAGE;
                        const pageItems = filtered.slice(start, start + PER_PAGE);
                        if (pageItems.length === 0) {
                            return <p>No contacts found.</p>;
                        }
                        return pageItems.map((contact) => (
                            <div key={contact.id} className="contact-card contact--batman">
                                <img src={contact.photo} alt={contact.name} />
                                <h3>{contact.name}</h3>
                                <p>{contact.phone}</p>
                                <p>{contact.email}</p>
                            </div>
                        ));
                    })()}
                </div>

                <div className="pagination" style={{ marginTop: 12 }}>
                    <button
                        className="btn"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        data-testid="btn-prev"
                    >
                        Previous
                    </button>
                    <span style={{ margin: "0 8px" }}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="btn"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        data-testid="btn-next"
                    >
                        Next
                    </button>
                </div>

            </section>

            <section className="form" aria-labelledby="form-heading">
                <h2 id="form-heading">Add a Hero Contact</h2>
                <form className="form__body" onSubmit={handleSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                             placeholder="e.g., Tony Stark"
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            minLength={2}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            inputMode="tel"
                            placeholder="(555) 555-5555"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g., hero@domain.com"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="photo">Photo URL (optional)</label>
                        <input
                            id="photo"
                            name="photo"
                            type="url"
                            placeholder="https://example.com/hero.jpg"
                            value={form.photo}
                            onChange={(e) => setForm({ ...form, photo: e.target.value })}
                        />
                    </div>
                    <div className="form__actions">
                        <button className="btn" type="submit" data-testid="btn-add">
                            Add Contact
                        </button>
                    </div>
                </form>
            </section>

            <footer className="page__footer">
                <small>
                    Starter provided. Complete tasks per README and make this page
                    shine.
                </small>
            </footer>
        </main>
    );
}
export default App;
