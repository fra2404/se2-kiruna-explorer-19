import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: (message: string) => {
        console.log(message);
    },
    setFeedbackFromError: (error: any) => {
        console.error(error);
    },
    setShouldRefresh: () => {}
});

export default FeedbackContext;