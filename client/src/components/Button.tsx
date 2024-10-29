import { Button } from "@material-tailwind/react";


export function ButtonRounded() {
    return (
        <div className="flex items-center gap-4">
            <Button className="rounded-full">Welcome</Button>
        </div>
    );
}