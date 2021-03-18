/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fragment, useCallback } from 'react';
import { FaRegTrashAlt, FaSearchPlus, FaEdit } from 'react-icons/fa';

import { SignalKinds } from '../../../../data/constants/SignalsKinds';
import { useAssignmentData } from '../../../assignment';
import { useDispatch } from '../../../context/DispatchContext';
import SelectUncontrolled from '../../../elements/SelectUncontrolled';
import {
  useModal,
  positions,
  transitions,
} from '../../../elements/popup/Modal';
import EditRangeModal from '../../../modal/editRange/EditRangeModal';
import {
  SET_X_DOMAIN,
  RESET_SELECTED_TOOL,
  SET_SELECTED_TOOL,
  CHANGE_RANGE_SIGNAL_KIND,
  SAVE_EDITED_RANGE,
  DELETE_RANGE,
} from '../../../reducer/types/Types';

const styles = css`
  width: 66px;
  padding: 0 !important;
  button {
    background-color: transparent;
    border: none;
    padding: 5px;
  }

  button:disabled {
    opacity: 0.6;
  }
`;
const selectBoxStyle = {
  marginLeft: 2,
  marginRight: 2,
  border: 'none',
  height: '20px',
};

function ActionsColumn({ rowData, onHoverSignal, rowSpanTags }) {
  const dispatch = useDispatch();
  const modal = useModal();
  const assignmentData = useAssignmentData();

  const zoomRangeHandler = useCallback(() => {
    const margin = Math.abs(rowData.from - rowData.to);
    dispatch({
      type: SET_X_DOMAIN,
      xDomain: [rowData.from - margin, rowData.to + margin],
    });
  }, [dispatch, rowData.from, rowData.to]);

  const deleteRangeHandler = useCallback(() => {
    dispatch({
      type: DELETE_RANGE,
      payload: {
        id: rowData.id,
        assignmentData,
      },
    });
  }, [assignmentData, dispatch, rowData]);

  const changeRangeSignalKindHandler = useCallback(
    (value) => {
      dispatch({
        type: CHANGE_RANGE_SIGNAL_KIND,
        payload: {
          rowData,
          value,
        },
      });
    },
    [dispatch, rowData],
  );

  const saveEditRangeHandler = useCallback(
    (editedRowData) => {
      dispatch({
        type: SAVE_EDITED_RANGE,
        payload: {
          editedRowData,
          assignmentData,
        },
      });
    },
    [assignmentData, dispatch],
  );

  const closeEditRangeHandler = useCallback(() => {
    dispatch({ type: RESET_SELECTED_TOOL });
    modal.close();
  }, [dispatch, modal]);

  const openEditRangeHandler = useCallback(() => {
    dispatch({ type: SET_SELECTED_TOOL, selectedTool: 'editRange' });
    modal.show(
      <EditRangeModal
        onCloseEditRangeModal={closeEditRangeHandler}
        onSaveEditRangeModal={saveEditRangeHandler}
        onZoomEditRangeModal={zoomRangeHandler}
        rangeData={rowData}
      />,
      {
        position: positions.CENTER_RIGHT,
        transition: transitions.SCALE,
        isBackgroundBlur: false,
      },
    );
  }, [
    closeEditRangeHandler,
    dispatch,
    modal,
    rowData,
    saveEditRangeHandler,
    zoomRangeHandler,
  ]);

  return (
    <Fragment>
      <td {...onHoverSignal}>
        <SelectUncontrolled
          onChange={changeRangeSignalKindHandler}
          data={SignalKinds}
          value={rowData.tableMetaInfo.signal.kind}
          style={selectBoxStyle}
        />
      </td>
      <td {...rowSpanTags} css={styles}>
        <button
          type="button"
          className="delete-button"
          onClick={deleteRangeHandler}
        >
          <FaRegTrashAlt />
        </button>
        <button
          type="button"
          className="zoom-button"
          onClick={zoomRangeHandler}
        >
          <FaSearchPlus title="Zoom to range in spectrum" />
        </button>
        <button
          type="button"
          className="edit-button"
          onClick={openEditRangeHandler}
        >
          <FaEdit color="blue" />
        </button>
      </td>
    </Fragment>
  );
}

export default ActionsColumn;
