const BoldTextDisplay = (
    { label, content } : 
    { label: string, content: string }) => 
{
    return (
        <div>{label}: <span className="font-bold">{content}</span></div>
    );
}

export default BoldTextDisplay;