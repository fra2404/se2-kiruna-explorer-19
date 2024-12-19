import { ReactNode, createContext, useMemo } from "react"
import { municipalityCoordinates } from "../utils/municipalityCoordinates"

interface MunicipalityCoordinatesContextType {
  municipalityCoordinates: number[][][],
}

const MunicipalityCoordinatesContext = createContext<MunicipalityCoordinatesContextType>(
  {} as MunicipalityCoordinatesContextType
)

export const MunicipalityCoordinatesProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  const v = useMemo(() => ({
    municipalityCoordinates
  }), [])

  return(
    <MunicipalityCoordinatesContext.Provider
      value={v}
    >
      {children}
    </MunicipalityCoordinatesContext.Provider>
  )
}

export default MunicipalityCoordinatesContext;