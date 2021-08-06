import { computed, defineComponent, onMounted, ref } from 'vue';
import './index.scss';

export default defineComponent({
  name: 'picker',
  props: {
    rowsNumber: {
      type: Number,
      default: 5,
    },
    itemHeight: {
      type: Number,
      default: 37,
    },
  },

  setup(props) {
    const pickerList = ref<string[]>([]);
    const startPageX = ref(0);
    const movePageX = ref(0);
    const currentPageX = ref(0);
    const selectIndex = ref(0);
    const moveIndex = ref(0);

    const initDate = () => {
      for (let i = 0; i < 20; i++) {
        pickerList.value.push(`test${i + 1}`);
      }
    };

    const initTop = computed(() => {
      const topItemNumber = Math.floor(props.rowsNumber / 2);
      return topItemNumber * props.itemHeight;
    });

    const slidingStyle = (index: number) => {
      const curretIndex = moveIndex.value + selectIndex.value;

      if (curretIndex === index) {
        return {
          transform: `rotateX(0deg)`,
          fontSize: 18 + 'px',
          fontWeight: 600,
        };
      } if (curretIndex > index) {
        return { transform: `rotateX(${18 * (curretIndex - index) + 18}deg)` };
      } if (curretIndex < index) {
        return { transform: `rotateX(-${18 * (index - curretIndex) + 18}deg)` };
      }
      return { transform: `rotateX(0deg)` };
    };

    const renderColumnItems = () => {
      return pickerList.value.map((item, i) => {
        return (
          <li
            style={{
              ...slidingStyle(i),
              height: props.itemHeight + 'px',
              lineHeight: props.itemHeight + 'px',
            }}
          >
            {item}
          </li>
        );
      });
    };

    onMounted(() => {
      initDate();
    });

    const touchstart = (event: TouchEvent) => {
      // 设置滑动起点
      startPageX.value = event.touches[0].pageY;
    };

    const touchmove = (event: TouchEvent) => {
      event.preventDefault();

      const moveDistance = event.touches[0].pageY - startPageX.value;
      // 滚动到底部禁止滑动
      if (
        selectIndex.value + moveIndex.value === pickerList.value.length - 1 &&
        moveDistance < 0
      ) {
        return;
      }
      // 滚动到顶禁止滑动
      if (selectIndex.value + moveIndex.value === 0 && moveDistance > 0) {
        return;
      }
      // 滑动中设置参数
      movePageX.value = moveDistance * 2;
      moveIndex.value = Math.round(-movePageX.value / props.itemHeight);
    };

    const onTouchend = () => {
      // 当前滑动状态保存
      selectIndex.value = moveIndex.value + selectIndex.value;
      currentPageX.value = -(selectIndex.value * props.itemHeight);
      // console.log(selectIndex.value, (pickerList.value.length - 1) * 50)
      // console.log(currentPageX.value)

      //  滑动超出底部置为最后一个
      if (
        -(selectIndex.value * props.itemHeight) <
        -(pickerList.value.length - 1) * props.itemHeight
      ) {
        currentPageX.value = -(pickerList.value.length - 1) * props.itemHeight;
        selectIndex.value = pickerList.value.length - 1;
      }
      //  滑动超出顶部置为第一个
      if (currentPageX.value > 0) {
        currentPageX.value = 0;
        selectIndex.value = 0;
      }

      // 清除滑动中参数
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
