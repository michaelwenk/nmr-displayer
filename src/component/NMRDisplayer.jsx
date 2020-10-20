/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { setAutoFreeze } from 'immer';
import OCL from 'openchemlib/full';
import PropTypes from 'prop-types';
import {
  useEffect,
  useCallback,
  useReducer,
  useState,
  useMemo,
  useRef,
  memo,
} from 'react';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { initOCL } from 'react-ocl-nmr';
import SplitPane from 'react-split-pane';
import { useToggle, useFullscreen } from 'react-use';

import { Analysis } from '../data/Analysis';

import Viewer1D from './1d/Viewer1D';
import Viewer2D from './2d/Viewer2D';
import ErrorBoundary from './ErrorBoundary';
import KeyListener from './EventsTrackers/keysListener';
import { AssignmentProvider } from './assignment';
import helpList, { setBaseUrl } from './constants/help';
import { ChartDataProvider } from './context/ChartContext';
import { DispatchProvider } from './context/DispatchContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { HelpProvider } from './elements/Help';
import { ModalProvider } from './elements/Modal';
import Header from './header/Header';
import { HighlightProvider } from './highlight';
import DropZone from './loader/DropZone';
import Panels from './panels/Panels';
import {
  spectrumReducer,
  initialState,
  dispatchMiddleware,
} from './reducer/Reducer';
import { DISPLAYER_MODE } from './reducer/core/Constants';
import {
  preferencesInitialState,
  preferencesReducer,
  INIT_PREFERENCES,
} from './reducer/preferencesReducer';
import { INITIATE, SET_WIDTH, SET_LOADING_FLAG } from './reducer/types/Types';
import ToolBar from './toolbar/ToolBar';

setAutoFreeze(true);

initOCL(OCL);

// alert optional cofiguration
const alertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
  containerStyle: { fontSize: '18px', zIndex: 999999 },
};

const splitPaneStyles = {
  container: {
    position: 'relative',
    height: 'none',
  },
  pane1: { maxWidth: '80%' },
  resizer: {
    width: 10,
    backgroundColor: '#f7f7f7',
    cursor: 'ew-resize',
  },
  pane: { overflow: 'hidden' },
};

const containerStyles = css`
  background-color: white;
  width: 100%;
  display: block;
  height: 100%;

  // height: 100%;
  // display: flex;
  // flex-direction: column;
  div:focus {
    outline: none !important;
  }
  button:active,
  button:hover,
  button:focus,
  [type='button']:focus,
  button {
    outline: none !important;
  }
  * {
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .SplitPane {
    height: 100%;
  }
`;

const NMRDisplayer = memo(
  ({
    data: dataProp,
    // height: heightProp,
    // width: widthProps,
    onDataChange,
    docsBaseUrl,
    preferences,
  }) => {
    const fullScreenRef = useRef();
    const [show, toggle] = useToggle(false);
    const isFullscreen = useFullscreen(fullScreenRef, show, {
      onClose: () => {
        toggle(false);
      },
    });

    const [isResizeEventStart, setResizeEventStart] = useState(false);
    const [helpData, setHelpData] = useState(helpList());

    const [state, dispatch] = useReducer(spectrumReducer, initialState);
    const [preferencesState, dispatchPreferences] = useReducer(
      preferencesReducer,
      preferencesInitialState,
    );

    const { selectedTool, displayerMode } = state;

    useEffect(() => {
      dispatchPreferences({
        type: INIT_PREFERENCES,
        payload: { display: preferences, dispatch: dispatchPreferences },
      });
    }, [preferences]);

    useEffect(() => {
      dispatch({ type: SET_LOADING_FLAG, isLoading: true });
      Analysis.build(dataProp || {}).then((object) => {
        dispatch({ type: INITIATE, data: { AnalysisObj: object } });
      });
    }, [dataProp]);

    useEffect(() => {
      setBaseUrl(docsBaseUrl);
      setHelpData(helpList());
    }, [docsBaseUrl]);

    const handleSplitPanelDragFinished = useCallback((size) => {
      setResizeEventStart(false);
      dispatch({ type: SET_WIDTH, width: size });
    }, []);

    const dispatchMiddleWare = useMemo(() => {
      function dataChangeHandler(data) {
        onDataChange(data);
      }
      return dispatchMiddleware(dispatch, dataChangeHandler);
    }, [onDataChange]);

    return (
      <ErrorBoundary>
        <PreferencesProvider value={preferencesState}>
          <HelpProvider data={helpData} wrapperID="main-wrapper">
            <AlertProvider template={AlertTemplate} {...alertOptions}>
              <DispatchProvider value={dispatchMiddleWare}>
                <ChartDataProvider value={{ ...state, isResizeEventStart }}>
                  <ModalProvider wrapperID="main-wrapper">
                    <KeyListener parentRef={fullScreenRef} />
                    <HighlightProvider>
                      <AssignmentProvider>
                        <div ref={fullScreenRef} css={containerStyles}>
                          <Header
                            isFullscreen={isFullscreen}
                            onMaximize={toggle}
                          />
                          {/* ref={containerRef} */}
                          <div
                            style={{
                              height: 'calc(100% - 36px)',
                              width: '100%',
                              backgroundColor: 'white',
                            }}
                          >
                            <DropZone>
                              <ToolBar selectedTool={selectedTool} />
                              <SplitPane
                                style={splitPaneStyles.container}
                                paneStyle={splitPaneStyles.pane}
                                resizerStyle={splitPaneStyles.resizer}
                                pane1Style={splitPaneStyles.pane1}
                                split="vertical"
                                defaultSize="calc(100% - 600px)"
                                minSize="80%"
                                onDragFinished={handleSplitPanelDragFinished}
                                onDragStarted={() => {
                                  setResizeEventStart(true);
                                }}
                              >
                                {displayerMode === DISPLAYER_MODE.DM_1D ? (
                                  <Viewer1D />
                                ) : (
                                  <Viewer2D />
                                )}
                                <Panels
                                  selectedTool={selectedTool}
                                  displayerMode={displayerMode}
                                />
                              </SplitPane>
                            </DropZone>
                          </div>
                          <div id="main-wrapper" />
                        </div>
                      </AssignmentProvider>
                    </HighlightProvider>
                  </ModalProvider>
                </ChartDataProvider>
              </DispatchProvider>
            </AlertProvider>
          </HelpProvider>
        </PreferencesProvider>
      </ErrorBoundary>
    );
  },
);

NMRDisplayer.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  docsBaseUrl: PropTypes.string,
  onDataChange: PropTypes.func,
  preferences: PropTypes.shape(
    {
      general: PropTypes.shape({
        disableMultipletAnalysis: PropTypes.bool,
        hideSetSumFromMolecule: PropTypes.bool,
      }),
      panels: PropTypes.shape({
        hideSpectraPanel: PropTypes.bool,
        hideInformationPanel: PropTypes.bool,
        hidePeaksPanel: PropTypes.bool,
        hideIntegralsPanel: PropTypes.bool,
        hideRangesPanel: PropTypes.bool,
        hideStructuresPanel: PropTypes.bool,
        hideFiltersPanel: PropTypes.bool,
      }),
      toolsBarButtons: PropTypes.shape({
        hideZoomTool: PropTypes.bool,
        hideZoomOutTool: PropTypes.bool,
        hideImport: PropTypes.bool,
        hideExportAs: PropTypes.bool,
        hideSpectraStackAlignments: PropTypes.bool,
        hideSpectraCenterAlignments: PropTypes.bool,
        hideRealImaginary: PropTypes.bool,
        hidePeakTool: PropTypes.bool,
        hideIntegralTool: PropTypes.bool,
        hideAutoRangesTool: PropTypes.bool,
        hideZeroFillingTool: PropTypes.bool,
        hidePhaseCorrectionTool: PropTypes.bool,
        hideBaseLineCorrectionTool: PropTypes.bool,
        hideFFTTool: PropTypes.bool,
      }),
    },
    true,
  ),
};

NMRDisplayer.defaultProps = {
  height: 600,
  width: 800,
  docsBaseUrl: 'https://cheminfo.github.io/nmr-displayer/docs/v0',
  onDataChange: () => null,
  preferences: {
    general: {
      disableMultipletAnalysis: false,
      hideSetSumFromMolecule: false,
    },

    panels: {
      hideSpectraPanel: false,
      hideInformationPanel: false,
      hidePeaksPanel: false,
      hideIntegralsPanel: false,
      hideRangesPanel: false,
      hideStructuresPanel: false,
      hideFiltersPanel: false,
      hideZonesPanel: false,
      hideSummaryPanel: false,
    },

    toolsBarButtons: {
      hideZoomTool: false,
      hideZoomOutTool: false,
      hideImport: false,
      hideExportAs: false,
      hideSpectraStackAlignments: false,
      hideSpectraCenterAlignments: false,
      hideRealImaginary: false,
      hidePeakTool: false,
      hideIntegralTool: false,
      hideAutoRangesTool: false,
      hideZeroFillingTool: false,
      hidePhaseCorrectionTool: false,
      hideBaseLineCorrectionTool: false,
      hideFFTTool: false,
    },
  },
};

export default NMRDisplayer;
