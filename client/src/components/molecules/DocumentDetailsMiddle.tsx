import BoldTextDisplay from "../atoms/BoldTextDisplay";

interface DisplayType {
    label: string;
    content: string;
}

const DocumentDetailsMiddle = ({ list } : DisplayType[]) => {
    return (
        <>
            {list.map((item, index) => (
                <BoldTextDisplay key={index} label={item.label} content={item.content} />
            ))}
        </>
    );
};

export default DocumentDetailsMiddle;