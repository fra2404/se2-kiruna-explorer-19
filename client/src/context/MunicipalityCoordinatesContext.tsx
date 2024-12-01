import { ReactNode, createContext } from "react"
import { municipalityCoordinates } from "../utils/municipalityCoordinates"

interface MunicipalityCoordinatesContextType {
  municipalityCoordinates: number[][][]
}

const MunicipalityCoordinatesContext = createContext<MunicipalityCoordinatesContextType>(
  {} as MunicipalityCoordinatesContextType
)

export const MunicipalityCoordinatesProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  return(
    <MunicipalityCoordinatesContext.Provider
      value={{
        municipalityCoordinates
      }}
    >
      {children}
    </MunicipalityCoordinatesContext.Provider>
  )
}

export default MunicipalityCoordinatesContext;