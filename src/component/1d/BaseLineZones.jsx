import { jsx, css } from '@emotion/core';
import { useCallback } from 'react';
/** @jsx jsx */

import { useChartData } from '../context/ChartContext';
import { useDispatch } from '../context/DispatchContext';
import { useScale } from '../context/ScaleContext';
import DeleteButton from '../elements/DeleteButton';
import { DELETE_BASE_LINE_ZONE } from '../reducer/types/Types';

const styles = css`
  pointer-events: bounding-box;
  user-select: 'none';
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */

  .zone-area {
    height: 100%;
    fill: #b8b8b857;
    cursor: pointer;
  }
  .delete-button {
    display: none;
    cursor: pointer;
  }
  :hover .delete-button {
    display: block;
  }
`;

const BaseLineZones = () => {
  const { baseLineZones } = useChartData();

  const { scaleX } = useScale();
  const dispatch = useDispatch();

  const deleteRangeHandler = useCallback(
    (id) => {
      dispatch({ type: DELETE_BASE_LINE_ZONE, id });
    },
    [dispatch],
  );

  return (
    baseLineZones &&
    Array.isArray(baseLineZones) &&
    baseLineZones.length > 0 && (
      <g>
        {baseLineZones.map((zone) => (
          <g
            key={zone.id}
            transform={`translate(${scaleX()(zone.to)},0)`}
            css={styles}
          >
            <DeleteButton
              x={-20}
              y={10}
              onDelete={() => deleteRangeHandler(zone.id)}
            />
            <rect
              x="0"
              width={`${scaleX()(zone.from) - scaleX()(zone.to)}`}
              className="zone-area"
            />
          </g>
        ))}
      </g>
    )
  );
};

export default BaseLineZones;
