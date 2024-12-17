/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../src/global.js";
import Graph from "react-graph-vis";
import './Diagram.css';
import { useState, useEffect, useRef, useContext } from "react";
import API, { getTypes } from "../API";
import ErrorImage from '../assets/icons/error.png';
import DefaultIcon from '../assets/icons/default-icon.svg';
import AgreementIcon from "../assets/icons/agreement-icon.svg";
import ConflictIcon from '../assets/icons/conflict-icon.svg';
import ConsultationIcon from '../assets/icons/consultation-icon.svg';
import DesignDocIcon from '../assets/icons/design-doc-icon.svg';
import InformativeDocIcon from '../assets/icons/informative-doc-icon.svg';
import MaterialEffectsIcon from '../assets/icons/material-effects-icon.svg';
import PrescriptiveDocIcon from '../assets/icons/prescriptive-doc-icon.svg';
import TechnicalDocIcon from '../assets/icons/technical-doc-icon.svg';
import "vis-network/styles/vis-network.css";
import {
    swedishFlagBlue,
    swedishFlagYellow,
} from '../utils/colors';
import { IDocument } from "../utils/interfaces/document.interface.js";
import Legend from './Legend';
import { LatLng } from "leaflet";
import FeedbackContext from "../context/FeedbackContext.js";
import { Header } from "../components/organisms/Header.js";
import useDocuments from "../utils/hooks/documents.js";
import { DocumentConnectionsList } from "../components/molecules/documentsItems/DocumentConnectionsList.js";
import SidebarContext from "../context/SidebarContext.js";

const LABEL_FONT = { size: 50, color: "#000000" };
const OFFSET_VIEW = { x: 200, y: 500 };
const YEAR_SPACING = 500;
const options = {
    autoResize: true,
    layout: {
        hierarchical: false
    },
    physics: {
        enabled: false // Disable physics to prevent nodes from moving
    },
    interaction: {
        dragNodes: true, // Enable dragging nodes (improves the readability)
        dragView: true, // Enable dragging of the view
        zoomView: true, // Enable zooming of the view
        navigationButtons: true, // Enable navigation buttons
        hover: true
    },
};

const graphBEInfo = await API.getGraphInfo();

const Diagram = () => {
    const { setFeedbackFromError } = useContext(FeedbackContext);
    const headerRef = useRef<HTMLDivElement>(null);
    const {selectedDocument, setSelectedDocument, setSidebarVisible} = useContext(SidebarContext);
    const [types, setTypes] = useState<any[]>([]);

    //Needed to show a document's information when hovering on it
    const [documentInfoPopup, setDocumentInfoPopup] = useState<{visible: boolean, x: number, y: number, content: any}>({ visible: false, x: 0, y: 0, content: '' });

    const {allDocuments, setAllDocuments, filteredDocuments, setFilteredDocuments} = useDocuments();
    const [coordinates, setCoordinates] = useState({});
    const [state, setState] = useState({
        graph: {
            nodes: [] as any[],
            edges: [] as { from: any; to: any; color: string }[]
        }
    });

    const label_year = [] as any[];
    const minYear = graphBEInfo.minYear;
    const maxYear = graphBEInfo.maxYear;
    const networkRef = useRef<any>(null);

    let lastPosition: any = null;
    const max_zoom = 2;
    const min_zoom = 0.1;

    const [firstLoad, setFirstLoad]=useState(true);

    const openSidebar = (document: IDocument) => {
        // Search in the original documents and show the document in the modal 
        const sdocument = allDocuments.find((doc) => doc.id === document.id);
        if (sdocument) {
          setSelectedDocument(sdocument);
          setSidebarVisible(true);
        }
    };

    const handleNodeClick = (document: IDocument) => {
      openSidebar(document);
    }

    // State to store the min and max values from all the nodes 
    const [graphBounds, setGraphBounds] = useState({ minY: 0, maxY: 1440, minX: 0, maxX: 12000 });

    const checkGraphConstraints = (event: any) => {
        if (event.deltaY !== 0 || event.deltaX !== 0) {
            const network = networkRef.current;
            const currentPosition = network.getViewPosition();
            
            if (currentPosition.y < graphBounds.minY - OFFSET_VIEW.y) {
                if (currentPosition.x < graphBounds.minX - OFFSET_VIEW.x) {
                    network.moveTo({ position: { x: graphBounds.minX + OFFSET_VIEW.x, y: graphBounds.minY - OFFSET_VIEW.y } });
                }
                else if (currentPosition.x > graphBounds.maxX + OFFSET_VIEW.x) {
                    network.moveTo({ position: { x: graphBounds.maxX - OFFSET_VIEW.x, y: graphBounds.minY - OFFSET_VIEW.y } });
                }
                else {
                    network.moveTo({ position: { x: currentPosition.x, y: graphBounds.minY - OFFSET_VIEW.y } });
                }
            } else if (currentPosition.y > graphBounds.maxY + OFFSET_VIEW.y) {
                if (currentPosition.x < graphBounds.minX - OFFSET_VIEW.x) {
                    network.moveTo({ position: { x: graphBounds.minX + OFFSET_VIEW.x, y: graphBounds.maxY + OFFSET_VIEW.y } });
                }
                else if (currentPosition.x > graphBounds.maxX + OFFSET_VIEW.x) {
                    network.moveTo({ position: { x: graphBounds.maxX - OFFSET_VIEW.x, y: graphBounds.maxY + OFFSET_VIEW.y } });
                }
                else {
                    network.moveTo({ position: { x: currentPosition.x, y: graphBounds.maxY + OFFSET_VIEW.y } });
                }
            }
            else if (currentPosition.x < graphBounds.minX - OFFSET_VIEW.x) {
              network.moveTo({ position: { x: graphBounds.minX + OFFSET_VIEW.x, y: currentPosition.y } });
            }
            else if (currentPosition.x > graphBounds.maxX + OFFSET_VIEW.x) {
              network.moveTo({ position: { x: graphBounds.maxX - OFFSET_VIEW.x, y: currentPosition.y } });
            }

        }
    };

    const savePosition = () => {
        const position = networkRef.current.getViewPosition();
        lastPosition = position;
    }

    useEffect(() => {
        // Fetch the document types from the backend
        const fetchDocumentTypes = async () => {
            try {
                const documentTypes = await getTypes();
                setTypes(documentTypes);

            } catch (error) {
                console.error(`Error fetching types`, error);
            }
        };
        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        API.getCoordinates()
            .then((coords) => {
                const result: {
                    [id: string]: {
                        type: string;
                        coordinates: LatLng | LatLng[] | LatLng[][];
                        name: string;
                    };
                } = {};
                coords.forEach(
                    (c: {
                        _id: string;
                        type: string;
                        coordinates: LatLng | LatLng[] | LatLng[][];
                        name: string;
                    }) => {
                        result[c._id] = {
                            type: c.type,
                            coordinates: c.coordinates,
                            name: c.name,
                        };
                    },
                );
                setCoordinates(result);
            })
            .catch((e) => {
                console.log(e);
                setFeedbackFromError(e);
            });
    }, []);

    const architecturalScales: [{ id: string, label: string, scale: string }] = [];
    let lastMap = 600;  // Starting Y position for the architectural scales
    const architecturalScalesMapping: any = {};

    filteredDocuments.filter((d) => d.scale == 'ARCHITECTURAL' && d.architecturalScale).sort((a, b) => {
        if(a.architecturalScale && b.architecturalScale) {
          return +b.architecturalScale.split(':')[1] - (+a.architecturalScale.split(':')[1]);       //The '+' is used to convert from string to number
        }
        return 0;
    }).forEach((d) => {
        if (d.architecturalScale && !(architecturalScales.map((s) => s.id).includes(d.architecturalScale))) {
            architecturalScales.push({ id: d.architecturalScale, label: d.architecturalScale, scale: d.architecturalScale })
            architecturalScalesMapping[d.architecturalScale] = lastMap;
            lastMap += 200;
        }
    });

    const scaleMapping = {
        "TEXT": 200,
        "CONCEPT": 400,
        ...architecturalScalesMapping,
        "BLUEPRINT/MATERIAL EFFECTS": lastMap,
        "default": 50,
    };

    useEffect(() => {
        const connections = [] as any[];
        // Map the data from the BE to the format that the graph component expects.
        filteredDocuments.forEach((doc: any) => {
            // Check the scale
            if (doc.scale.toUpperCase() === "TEXT") {
                doc.scale = "TEXT";
            }
            else if (doc.scale.toUpperCase() === "CONCEPT") {
                doc.scale = "CONCEPT";
            }
            else if (doc.scale.toUpperCase() === "ARCHITECTURAL") {
                doc.scale = 'ARCHITECTURAL';
            }
            else if (doc.scale.toUpperCase() === "BLUEPRINT/MATERIAL EFFECTS") {
                doc.scale = "BLUEPRINT/MATERIAL EFFECTS";
            }
            if (!doc.scale) {
                doc.scale = "default";
            }

            // Check the year
            if (doc.date) {
                const date = new Date(doc.date);
                if (!isNaN(date.getTime())) {
                    doc.year = date.getFullYear();
                }
            } else {
                console.log(`No date provided, the document ${doc.id} will not be displayed`);
                doc.year = null;    // If the date is not provided, the document will not be displayed
            }

            // Check the type of the document
            const docType = Array.isArray(types) ? types.find((docTypes: any) => docTypes.label === doc.type.type.toUpperCase()) : null;
            switch (docType.label) {
                case "AGREEMENT":
                    doc.image = AgreementIcon;
                    break;
                case "CONFLICT":
                    doc.image = ConflictIcon;
                    break;
                case "CONSULTATION":
                    doc.image = ConsultationIcon;
                    break;
                case "PRESCRIPTIVE_DOC":
                    doc.image = PrescriptiveDocIcon;
                    break;
                case "INFORMATIVE_DOC":
                    doc.image = InformativeDocIcon;
                    break;
                case "DESIGN_DOC":
                    doc.image = DesignDocIcon;
                    break;
                case "TECHNICAL_DOC":
                    doc.image = TechnicalDocIcon;
                    break;
                case "MATERIAL_EFFECTS":
                    doc.image = MaterialEffectsIcon;
                    break;
                default:
                    // Default icon for the documents that do not have an image (new types)
                    doc.image = DefaultIcon;
                    break;
            }

            // Check the connections
            let connectionColor : string;
            const connectionWidth : number = 5;
            let dashesType = false as boolean | number[] | undefined;   // In case of an array the first element is the lenght of the dash, the second is the space between the dashes

            if (doc.connections && doc.connections.length > 0) {
                doc.connections.forEach((connection: any) => {
                    // Modify the style of the connections according to their type
                    if (connection.type.toUpperCase() === "DIRECT") {
                        connectionColor = "#007BFF";
                    } else if (connection.type.toUpperCase() === "COLLATERAL") {
                        connectionColor = "#FFA500";
                    } else if (connection.type.toUpperCase() === "PROJECTION") {
                        connectionColor = "#28A745";
                    } else if (connection.type.toUpperCase() === "UPDATE") {
                        connectionColor = "#6F42C1";
                    }

                    connections.push({
                        ...connection,
                        from: doc.id,
                        to: connection.document,
                        color: connectionColor,
                        dashes: dashesType,
                        width: connectionWidth
                    });
                });
            }
        });

        const nodes_documents = filteredDocuments
            .filter((doc: any) => doc.year !== null) // Filter documents with defined year
            .map((doc: any) => ({
                id: doc.id,
                shape: "image",
                image: doc.image,
                size: 50,
                brokenImage: ErrorImage,
                year: doc.year,
                scale: doc.scale,
                architecturalScale: doc.architecturalScale
            }))
            .map(node => ({
                ...node,
                x: (node.year - 2000) * YEAR_SPACING, // Mapping the year
                y: scaleMapping[node.scale == 'ARCHITECTURAL' ? node.architecturalScale : node.scale as keyof typeof scaleMapping], // Mapping the scale
            }));


        nodes_documents.forEach((node) => {
            const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
            if (overlappingNode) {
                const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
                node.x += offsetX;  // Add offset to x position
            }
        });

        const allNodes = [...nodes_documents, ...label_style, ...label_year];
        allNodes.forEach((node) => {
            const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
            if (overlappingNode) {
                const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
                const offsetY = Math.floor(Math.random() * 30) + 20; // Random offset between 20 and 50
                node.x += offsetX;  // Add offset to x position
                node.y += offsetY; // Add offset to y position
            }
            occupiedPositions.push({ x: node.x, y: node.y });
        });

        const yValues = allNodes.map(node => node.y);
        const xValues = allNodes.map(node => node.x);
        // Store the min and max values of the nodes
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        setGraphBounds({ minY, maxY, minX, maxX });

        setState({
            graph: {
                nodes: allNodes,
                edges: connections
            },
        })
    }, [filteredDocuments, types]);

    const occupiedPositions = [] as any;
    const computeYearX = (year: number) => {
        return (year - 2000) * YEAR_SPACING;
    };

    const computeStyleY = (node: any) => {
        return scaleMapping[node.scale == 'ARCHITECTURAL' ? node.architecturalScale : node.scale as keyof typeof scaleMapping];
    }

    const label_style = [
        { id: "label_text", label: "Text", scale: "TEXT" },
        { id: "label_concept", label: "Concept", scale: "CONCEPT" },
        ...architecturalScales,
        { id: "label_blueprint", label: "Blueprint/effects", scale: "BLUEPRINT/MATERIAL EFFECTS" },
    ].map(node => ({
        ...node,
        color: swedishFlagBlue,
        x: (minYear - 2000 - 1) * YEAR_SPACING, // Place the label on the left side of the graph, it depends on the minYear
        y: computeStyleY(node),
        shape: "box",
        font: { ...LABEL_FONT, color: "#FFFFFF" },

    }));

    for (let year = minYear; year <= maxYear; year++) {
        label_year.push({
            id: `label_${year}`,
            label: `${year}`,
            color: swedishFlagYellow,
            year: year,
            x: computeYearX(year), // Mapping the year
            y: 50, // Place the label on the top side of the graph
            shape: "box",
            font: LABEL_FONT
        });
    }

    useEffect(() => {
        const network = networkRef.current; // Get the network object from the ref

        if (network) {  // if the network is available then...
            // If a node is selected, then the graph will be centered on that node
            if (selectedDocument) {
                network.fit({
                    nodes: state.graph.nodes.filter((node: any) => {
                        return node.id === selectedDocument.id;
                    }).map((node: any) => node.id),
                    animation: false
                });
                setFirstLoad(false)
            }
            // Else center based on the current year (only at launch)
            else if(firstLoad) {
                network.fit({
                    // Filter only the node that are in the current year. In this way the graph will be centered on the current year at launch.
                    nodes: state.graph.nodes.filter((node: any) => {
                        const currentYear = new Date().getFullYear();
                        return node.year === currentYear;
                    }).map((node: any) => node.id),
                    animation: false
                });
            }

            network.moveTo({ scale: 0.4 })  // Set the initial zoom level
            network.on("zoom", function (params: any) {
                if (params.scale < min_zoom || params.scale > max_zoom) {
                    network.moveTo({
                        position: lastPosition, // use the last position before zoom limit
                        scale: params.scale > max_zoom ? max_zoom : min_zoom // this scale prevents zooming out beyond the desired limit
                    });
                } else {
                    // store the current position as the last position before zoom limit
                    lastPosition = network.getViewPosition();
                }
            });

            // on pan, store the current position
            network.on("dragEnd", function () {
                lastPosition = network.getViewPosition();
            });

        }
    }, [selectedDocument, state.graph.nodes]);


    useEffect(() => {
        // Check the boundaries of the selected node

        const nodeLastPosition = { x: 0, y: 0 };
        const MAX_NODE_OFFSET = 80;

        // Allow the user to move the node inside some boundaries
        const saveNodePosition = (event: any) => {
            const network = networkRef.current;
            const node = network.getPositions([event.nodes[0]])[event.nodes[0]];
            if (!node) {
                return;
            }
            nodeLastPosition.x = node.x;
            nodeLastPosition.y = node.y;
        }

        const checkNodeConstraints = (event: any) => {
            const network = networkRef.current;
            const node = network.getPositions([event.nodes[0]])[event.nodes[0]];
            if (!node) {
                return;
            }

            const nodeCurrentPosition = { x: node.x, y: node.y };

            const draggedNode = state.graph.nodes.find(n => n.id === event.nodes[0]);

            if (!draggedNode) {
                return;
            }

            const newposition = { x: nodeCurrentPosition.x, y: nodeCurrentPosition.y };
            const center_x = computeYearX(draggedNode.year);
            const center_y = computeStyleY(draggedNode);

            if (/^label_/.test(draggedNode.id) || /^1:/.test(draggedNode.id)) {
                // Regex to filter the labels to avoid moving them
                newposition.x = nodeLastPosition.x;
                newposition.y = nodeLastPosition.y;
            }
            else {
                if (nodeCurrentPosition.x - center_x > MAX_NODE_OFFSET) {
                    // If the node is too far to the right
                    newposition.x = center_x + MAX_NODE_OFFSET;
                } else if (nodeCurrentPosition.x - center_x < -MAX_NODE_OFFSET) {
                    // If the node is too far to the left
                    newposition.x = center_x - MAX_NODE_OFFSET;
                }
                if (nodeCurrentPosition.y - center_y > MAX_NODE_OFFSET) {
                    // If the node is too far to the top
                    newposition.y = center_y + MAX_NODE_OFFSET;
                } else if (nodeCurrentPosition.y - center_y < -MAX_NODE_OFFSET) {
                    // If the node is too far to the bottom
                    newposition.y = center_y - MAX_NODE_OFFSET;
                }
            }
            network.moveNode(event.nodes[0], newposition.x, newposition.y);



        }

        const network = networkRef.current;
        if (network) {
            network.on("dragStart", saveNodePosition);
            network.on("dragEnd", checkNodeConstraints);
        }

    }, [computeStyleY, state.graph.nodes]);


    useEffect(() => {
        const network = networkRef.current;

        network.on("dragStart", savePosition);
        network.on("dragEnd", checkGraphConstraints);
    }, [state.graph.nodes, graphBounds]);


    return (
        <div style={{ height: "100vh", position: "relative" }} className="grid-background">
            <Header 
                headerRef={headerRef}
                page='graph'
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                allDocuments={allDocuments}
                setAllDocuments={setAllDocuments}
                filteredDocuments={filteredDocuments}
                setFilteredDocuments={setFilteredDocuments}
            />

            <div style={{ position: "absolute", top: `${headerRef.current?.offsetHeight ? headerRef.current?.offsetHeight + 10 : 0}px`, left: "10px", zIndex: 10 }}>
                <Legend />
            </div>

            {state.graph && (
                <Graph
                    graph={state.graph}
                    options={options}
                    events={{
                        selectNode: function (event: { nodes: any; }) {
                            const { nodes } = event;
                            const selectedNode = state.graph.nodes.find(node => node.id === nodes[0]);
                            if (selectedNode) {
                                handleNodeClick(selectedNode);
                            }
                        },
                        hoverNode: function (event: {node: any, pointer: any}) {
                            const {node, pointer} = event;
                            const selectedNode = state.graph.nodes.find(n =>  n.id == node);
                            if(selectedNode) {
                                const sDocument = allDocuments.find((doc) => doc.id === selectedNode.id);
                                if(sDocument) {
                                    setDocumentInfoPopup({
                                        visible: true,
                                        x: pointer.DOM.x,
                                        y: pointer.DOM.y,
                                        content: (
                                            <DocumentConnectionsList 
                                                document={sDocument}
                                                allDocuments={allDocuments}
                                            />
                                        )
                                    });
                                }
                            }
                        },
                        blurNode: function () {
                            setDocumentInfoPopup({visible: false, x: 0, y: 0, content: ''})
                        }
                    }}
                    style={{ height: "100%" }}
                    getNetwork={network => {    // Call the methods inside the Graph component
                        networkRef.current = network;
                    }}
                />
            )}

            {documentInfoPopup.visible && (
                <div
                    style={{
                    position: "absolute",
                    top: documentInfoPopup.y,
                    left: documentInfoPopup.x + 10,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "5px",
                    zIndex: 1000,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {documentInfoPopup.content}
                </div>
            )}
        </div>
    );
};

export default Diagram;