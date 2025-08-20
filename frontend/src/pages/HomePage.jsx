import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";
import { LoaderIcon } from "lucide-react";

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/notes");
                setNotes(res.data);
                console.log(res.data);
                setIsRateLimited(false);
            } catch (error) {
                console.log("Error Fetching Notes", error);
                if (error.response?.status === 429) {
                    setIsRateLimited(true);
                }
                else {
                    toast.error("Failed to load notes");
                }
            }
            finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center"><LoaderIcon className="size-10 animate-spin" /></div>);
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            {isRateLimited && <RateLimitedUI />}

            <div className="max-w-7xl mx-auto p-4 mt-6">

                {notes.length === 0 && !isRateLimited && <NotesNotFound />}

                {notes.length > 0 && !isRateLimited && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map(note => (
                            <NoteCard key={note.id} note={note} setNotes={setNotes} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default HomePage;