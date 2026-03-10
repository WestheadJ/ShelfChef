import { createContext, useContext, useEffect, useState } from "react";
import { initDatabase } from "@/services/db/bootstrap";

interface DBContextType {
    ready: boolean;
}

const DBContext = createContext<DBContextType>({
    ready: false
});

export const DBProvider = ({ children }: { children: React.ReactNode }) => {

    const [ready, setReady] = useState(false);

    useEffect(() => {

        const bootstrapDB = async () => {
            try {
                await initDatabase();
                setReady(true);
            } catch (err) {
                console.error("DB Init Error", err);
            }
        };

        bootstrapDB();

    }, []);

    return (
        <DBContext.Provider value={{ ready }}>
            {ready ? children : null}
        </DBContext.Provider>
    );
};

export const useDBContext = () => useContext(DBContext);