import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import ColorPicker, { Panel1, Swatches, colorKit, Preview, HueCircular } from 'reanimated-color-picker';
import type { returnedResults } from 'reanimated-color-picker';

export default function CircularHue({setColor}: {setColor: (color: string) => void}) {

  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(customSwatches[0]);

  const onColorSelect = (color: returnedResults) => {
    selectedColor.value = color.hex;
    setColor(color.hex)
  };

  return (
    
      
          <View style={styles.pickerContainer}>
            <ColorPicker value={selectedColor.value} sliderThickness={15} thumbSize={24} onChange={onColorSelect} boundedThumb>
              <HueCircular containerStyle={styles.hueContainer} thumbShape='pill'>
                <Panel1 style={styles.panelStyle} />
              </HueCircular>
              <Swatches style={styles.swatchesContainer} swatchStyle={styles.swatchStyle} colors={customSwatches} />
                <View style={styles.previewTxtContainer}>
                <Preview hideInitialColor textStyle={{ fontSize: 12 }}/>
                </View>
            </ColorPicker>
          </View>

         

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: 'orange',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 250,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  hueContainer: {
    justifyContent: 'center',
  },
  panelStyle: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  previewTxtContainer: {
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
  },
  swatchesContainer: {
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 10,
    height: 15,
    width: 15,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  openButton: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
