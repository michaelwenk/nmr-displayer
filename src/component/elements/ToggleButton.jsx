/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { memo, useCallback, useState } from 'react';

import ToolTip from './ToolTip/ToolTip';

const styles = css`
  background-color: transparent;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: lightgray;
  }

  &.toggle-active {
    background-color: gray;
    color: white;
  }
`;

function ToggleButton({
  children,
  style,
  onClick,
  popupTitle,
  popupPlacement,
  defaultValue,
  disabled,
}) {
  const [flag, Toggle] = useState(defaultValue);

  const toggleHandler = useCallback(() => {
    onClick(!flag);

    Toggle(!flag);
  }, [onClick, flag]);
  return (
    <ToolTip title={popupTitle} popupPlacement={popupPlacement}>
      <button
        disabled={disabled}
        css={styles}
        style={style}
        className={flag ? 'toogle toggle-active' : 'toggle'}
        type="button"
        onClick={toggleHandler}
      >
        {children}
      </button>
    </ToolTip>
  );
}

ToggleButton.defaultProps = {
  popupTitle: '',
  popupPlacement: 'right',
  style: {},
  defaultValue: false,
  onClick: () => null,
  disabled: false,
};

export default memo(ToggleButton);
