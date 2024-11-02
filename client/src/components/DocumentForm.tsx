import InputComponent from "./atoms/input/input";

const DocumentForm = () => {
    return (
        <form className="w-full max-w-[600px] mt-10 bg-white border px-6 py-3 rounded">
            <InputComponent
                label="Title"
                type="text"
                required
            />

            <InputComponent
                label="Description"
                type="textarea"
                required
            />

            <InputComponent
                label="Type"
                type="select"
                options={[
                    { value: '1', label: 'Type 1' },
                    { value: '2', label: 'Type 2' },
                    { value: '3', label: 'Type 3' },
                ]}
                required
            />

            
        </form>
    )

}

export default DocumentForm;