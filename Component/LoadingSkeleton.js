import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const LoadingSkeleton = (props) => {
  const defaultItem =
    <>
      <View style={{ marginBottom: 16, height: 16, width: '100%' }} />
      <View style={{ marginBottom: 16, height: 16, width: '100%' }} />
      <View style={{ marginBottom: 32, height: 16, width: '60%' }} />
    </>;


  const {
    showContent = false,
    number = 3,
    style,
    renderItem = defaultItem,

  } = props;

//    const [arrSkeleton, setArrSkeleton] = useState([]);


  const renderImageSkeleton = () => {
    let arrSkeleton = [];
    for (let i = 0; i < number; i++) {
      arrSkeleton.push(<View key={i}>{renderItem}</View>);
    }

    return arrSkeleton.map((skeleton) => {
      return skeleton;
    });
  };


  return (
    showContent ?
      props.children
      :
      <View style={{ margin: 20, ...style }}>
        <SkeletonPlaceholder
          backgroundColor={'#ddd'}
          borderRadius={10}
          speed={1600}
        >
          <View>
            {renderImageSkeleton()}
          </View>

        </SkeletonPlaceholder>
      </View>
  );

}


export default LoadingSkeleton;
