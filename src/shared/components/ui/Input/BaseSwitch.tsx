import React, {memo} from 'react';
import {Platform, ViewStyle} from 'react-native';
import {Switch, SwitchProps} from 'tamagui';

type BaseSwitchProps = SwitchProps & {
  thumbColor?: string;
  scale?: number;
  thumbStyle?: ViewStyle;
};

const DEFAULT_THUMB_STYLE: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.1,
  shadowRadius: 1,
  elevation: 2,
};

export const BaseSwitch = memo(function BaseSwitch({
                                                     thumbColor = '#FFF',
                                                     scale = 0.8,
                                                     thumbStyle,
                                                     style,
                                                     checked,
                                                     backgroundColor,
                                                     borderColor,
                                                     ...props
                                                   }: BaseSwitchProps) {

  const defaultBg = checked ? '$defaultPrimary' : '$switch';
  const defaultBorder = checked ? '$defaultPrimary' : '$switchBorder';

  return (
    <Switch
      {...props}
      checked={checked}
      backgroundColor={backgroundColor ?? defaultBg}
      borderColor={borderColor ?? defaultBorder}
      style={[{transform: [{scale}]}, style]}
    >
      <Switch.Thumb
        animation="quick"
        style={[
          DEFAULT_THUMB_STYLE,
          Platform.select({
            android: {elevation: DEFAULT_THUMB_STYLE.elevation ?? 2},
            ios: {},
          }) as ViewStyle,
          {backgroundColor: thumbColor},
          thumbStyle,
        ]}
      />
    </Switch>
  );
});
