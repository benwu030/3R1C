import { Stack } from 'expo-router';
import ModalTitle from '@/components/ModalTitle';

const HeaderTitleComponent = (props: any) => <ModalTitle {...props} />;

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{
      title: 'New Item',
      headerStyle: {
        backgroundColor: '#776E65',
      },
      headerTitle: HeaderTitleComponent
    }}/>
  );
}