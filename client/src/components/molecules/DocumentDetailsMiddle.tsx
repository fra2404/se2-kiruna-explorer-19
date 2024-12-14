import BoldTextDisplay from "../atoms/BoldTextDisplay";

interface DisplayType {
    label: string;
    content: string;
}

const DocumentDetailsMiddle = (list : DisplayType[]) => {
    return (
        <>
            {list.map((item: DisplayType) => (
                <BoldTextDisplay key={item.label} label={item.label} content={item.content} />
            ))}
        </>
    );
};

export default DocumentDetailsMiddle;