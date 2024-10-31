import { Button } from "@material-tailwind/react";

//const { isLoggedIn, user } = useAuth();   // Retrieve this information from the context created by FAL


export function ButtonRounded() {
    return (
        <div className="flex items-center gap-4">
            <Button className="rounded-full">Welcome</Button>
        </div>
    );
}