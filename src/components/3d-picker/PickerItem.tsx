import { computed, defineComponent, onMounted, ref, PropType, watch } from 'vue';
import './index.scss';

export interface PickerItemDate {
  key: number,
  text: string,
}

export default defineComponent({
  name: 'picker-item',
  props: {
    rowsNumber: {
      type: Number,
      default: 5,
    },
    itemHeight: {
      type: Number,
      default: 37,
    },
    dataList: {
      type: Array as PropType<Array<PickerItemDate>>,
      default: () => [],
    }
  },
  emits: ['update-select'],
  setup(props, { emit }) {
    // const pickerList = toRef(props);
    const startPageX = ref(0);
    const movePageX = ref(0);
    const currentPageX = ref(0);
    const selectIndex = ref(0);
    const moveIndex = ref(0);

    // const initDate = () => {
    //   for (let i = 0; i < 20; i++) {
    //     pickerList.value.push(`test${i + 1}`);
    //   }
    // };

    const initTop = computed(() => {
      const topItemNumber = Math.floor(props.rowsNumber / 2);
      return topItemNumber * props.itemHeight;
    });

    watch(() => props.dataList, () => {

      startPageX.value = 0;
      movePageX.value = 0;
      currentPageX.value = 0;
      selectIndex.value = 0;
      moveIndex.value = 0;
    });

    onMounted(() => {
      // initDate();

    });

    const slidingStyle = (index: number) => {
      const curretIndex = moveIndex.value + selectIndex.value;

      if (curretIndex === index) {
        return {
          transform: `rotateX(0deg)`,
          fontSize: 14 + 'px',
          color: '#000'
          // fontWeight: 600,
        };
      } if (curretIndex > index) {
        return { transform: `rotateX(${15 * (curretIndex - index)}deg)` };
      } if (curretIndex < index) {
        return { transform: `rotateX(-${15 * (index - curretIndex)}deg)` };
      }
      return { transform: `rotateX(0deg)` };
    };

    const renderColumnItems = () => {
      return props.dataList.map((item, i) => {
        const curretIndex = moveIndex.value + selectIndex.value;
        if (curretIndex === i) {
          emit('update-select', item, i);
        }

        return (
          <li
            style={{
              ...slidingStyle(i),
              height: props.itemHeight + 'px',
              lineHeight: props.itemHeight + 'px',
            }}
          >
            {item.text}
          </li>
        );
      });
    };

    const touchstart = (event: TouchEvent) => {
      // ??????????????????
      startPageX.value = event.touches[0].pageY;
    };

    const touchmove = (event: TouchEvent) => {
      event.preventDefault();

      const moveDistance = event.touches[0].pageY - startPageX.value;
      // ???????????????????????????
      if (
        selectIndex.value + moveIndex.value === props.dataList.length - 1 &&
        moveDistance < 0
      ) {
        return;
      }
      // ????????????????????????
      if (selectIndex.value + moveIndex.value === 0 && moveDistance > 0) {
        return;
      }
      // ?????????????????????
      movePageX.value = moveDistance * 2;
      moveIndex.value = Math.round(-movePageX.value / props.itemHeight);
    };

    const onTouchend = () => {
      // ????????????????????????
      selectIndex.value = moveIndex.value + selectIndex.value;
      currentPageX.value = -(selectIndex.value * props.itemHeight);
      // console.log(selectIndex.value, (pickerList.value.length - 1) * 50)
      // console.log(currentPageX.value)

      //  ????????????????????????????????????
      if (
        -(selectIndex.value * props.itemHeight) <
        -(props.dataList.length - 1) * props.itemHeight
      ) {
        currentPageX.value = -(props.dataList.length - 1) * props.itemHeight;
        selectIndex.value = props.dataList.length - 1;
      }
      //  ?????????????????????????????????
      if (currentPageX.value > 0) {
        currentPageX.value = 0;
        selectIndex.value = 0;
      }

      // ?????????????????????
      movePageX.value = 0;
      moveIndex.value = 0;
    };

    return () => (
      <div
        class={['picker-box']}
        style={{ height: props.itemHeight * props.rowsNumber + 'px' }}
        onTouchstart={touchstart}
        onTouchmove={touchmove}
        onTouchend={onTouchend}
        onTouchcancel={onTouchend}
      >
        <div
          class="select-location"
          style={{ top: initTop.value + 'px', height: props.itemHeight + 'px' }}
        ></div>
        <ul
          style={{
            transform: `translateY(${movePageX.value + currentPageX.value + initTop.value
              }px)`,
          }}
        >
          {renderColumnItems()}
        </ul>

        {/* <div class="picker-mask"></div> */}
      </div>
    );
  },
});
