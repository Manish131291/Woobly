import { useEffect, useState } from 'react';

import { InputProps, XB_Input } from './XB_Input.component';

interface XBInputMaskedProps extends InputProps {
  id: string;
  getValue: (aadhaar) => void;
  classes?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: 'on' | 'off';
  msgType?: 'info' | 'success' | 'error' | 'loading' | 'verified' | '';
  infoMsgText?: string;
  regex?: any;
  maxLength?: number;
  disabled?: boolean;
  preValue?: string;
  mask?: string;
  spaceInterval?: number;
  maskLength?: number;
  maskTime?: number;
  showSuffixIcon?: boolean;
  disablePaste?: boolean;
}

export const XB_InputMasked = ({
  id,
  getValue,
  classes = '',
  label = '',
  placeholder = '',
  autoComplete = 'off',
  msgType,
  infoMsgText = '',
  regex = '',
  maxLength = 12,
  disabled = false,
  preValue = '',
  mask = '●', // chracter to be used for masking
  spaceInterval = 4, // No of character separated by an interval
  maskLength = 8, // number of character masked // 0 means all char are masked
  maskTime = 1000, // milliseconds after which value convert in mask
  showSuffixIcon = true,
  disablePaste = false,
  ...others
}: XBInputMaskedProps) => {
  const [unmaskedVal, setUnmaskedVal] = useState('');
  const [maskedVal, setMaskedVal] = useState('');
  const [timer, setTimer] = useState<any>(null);
  const [isShow, setIsShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);

  const addSpaceBetweenValue = (num) =>
    num.split('').reduce((acc: string, curr: string, index: number) => {
      const isSpaceNeeded = index !== 0 && index % spaceInterval === 0;
      return `${acc}${isSpaceNeeded ? ' ' : ''}${curr}`;
    }, '');

  const maskValue = (val: string) => {
    if (maskLength > 0) {
      return (
        mask.repeat(val.length > maskLength ? maskLength : val.length) +
        val.substring(maskLength)
      );
    } else {
      return mask.repeat(val.length);
    }
  };

  const eyeIcon = isShow ? 'eyeicon' : 'eyeOff';
  const onIconClick = (event) => {
    if (event.type === 'mouseleave') {
      setIsShow(false);
    } else {
      setIsShow((prev) => !prev);
    }
  };

  const clearTimeoutFn = () => {
    if (timer) clearTimeout(timer);
  };

  const regexCheck = (changedValue) => {
    if (regex && changedValue !== undefined) {
      return regex.test(changedValue);
    }
    return true;
  };

  const inpChange = (target) => {
    clearTimeoutFn();
    const cursorPos: number = target.selectionEnd;
    const maskCursor =
      cursorPos -
      (spaceInterval > 0 ? ~~((cursorPos + 1) / maskLength) - 1 : 0);
    // Masked value without space
    const targetVal = target.value.replace(/ /g, '');
    let tempUnmaskedVal = unmaskedVal.replace(/ /g, '');
    const startIndex =
      selectedIndex[0] -
      (spaceInterval > 0 ? ~~(selectedIndex[0] / (spaceInterval + 1)) : 0);
    const endIndex =
      selectedIndex[1] -
      (spaceInterval > 0 ? ~~(selectedIndex[1] / (spaceInterval + 1)) : 0);

    const changedValue: string = targetVal[startIndex];
    const isSelectPointsEqual = selectedIndex?.[0] === selectedIndex?.[1];
    /* istanbul ignore else */
    const regexRes = regexCheck(changedValue);
    if (!regexRes) return;
    /* istanbul ignore else */
    if (!isSelectPointsEqual) {
      tempUnmaskedVal =
        tempUnmaskedVal.slice(0, startIndex) +
        (changedValue !== mask ? changedValue || '' : '') +
        tempUnmaskedVal.slice(endIndex);
    } else if (targetVal.length < tempUnmaskedVal.length) {
      tempUnmaskedVal =
        tempUnmaskedVal.slice(0, startIndex - 1) +
        tempUnmaskedVal.slice(startIndex);
    } else if (targetVal.length !== tempUnmaskedVal.length) {
      tempUnmaskedVal =
        tempUnmaskedVal.slice(0, maskCursor) +
        changedValue +
        tempUnmaskedVal.slice(maskCursor);
    }

    let tempMaskedVal: string = targetVal
      .split('')
      .map((c, index) =>
        c === changedValue && index === startIndex ? c : mask
      )
      .join('');
    /* istanbul ignore else */
    if (maskLength)
      tempMaskedVal =
        tempMaskedVal.substring(0, maskLength) +
        tempUnmaskedVal.substring(maskLength);

    setMaskedVal(addSpaceBetweenValue(tempMaskedVal));
    setUnmaskedVal(addSpaceBetweenValue(tempUnmaskedVal));
    target.selectionStart = cursorPos;
    target.selectionEnd = cursorPos;

    setTimer(
      setTimeout(() => {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        setMaskedVal(addSpaceBetweenValue(maskValue(targetVal)));
        target.selectionStart = start;
        target.selectionEnd = end;
      }, maskTime)
    );
  };

  useEffect(() => {
    if (preValue !== unmaskedVal.replace(/ /g, '')) {
      setUnmaskedVal(addSpaceBetweenValue(preValue));
      setMaskedVal(addSpaceBetweenValue(maskValue(preValue)));
    }
  }, [preValue]);

  useEffect(() => {
    getValue(unmaskedVal.replace(/ /g, ''));
  }, [unmaskedVal]);

  return (
    <XB_Input
      id={id}
      label={label}
      onPaste={(event) => {
        /* istanbul ignore else */
        if (disablePaste) {
          event.preventDefault();
          return false;
        }
      }}
      classes={classes}
      placeholder={placeholder}
      type="text"
      autoComplete={autoComplete}
      msgType={msgType}
      value={isShow ? unmaskedVal : maskedVal}
      onSelect={({ target }: any) => {
        const { selectionStart, selectionEnd } = target;
        setSelectedIndex([selectionStart, selectionEnd]);
      }}
      onChange={(e) => inpChange(e.target)}
      onBlur={() => setSelectedIndex([])}
      onIconClick={onIconClick}
      suffixIcon={showSuffixIcon ? eyeIcon : ''}
      infoMsgText={infoMsgText}
      regex={regex}
      maxLength={maxLength}
      disabled={disabled}
      {...others}
    />
  );
};
