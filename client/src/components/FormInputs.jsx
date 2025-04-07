
import { Input } from './ui/input'
import { Label } from './ui/label'

const FormInputs = ({ fieldName,type, label, placeholder,accept, register, error,onChange }) => {
    return (
        <>
            <div className="grid w-full items-center gap-1.5 mb-4">
                <Label htmlFor={fieldName}>{label}</Label>
                <Input {...register(fieldName)} type={type} id={fieldName} placeholder={placeholder} className={error?.[fieldName] ? "border-red-500" : ""} accept={accept} onChange={onChange}/>
                {error?.[fieldName] && <span className="text-xs text-red-500">{error?.[fieldName].message}</span>}
            </div>
        </>
    )
}

export default FormInputs
