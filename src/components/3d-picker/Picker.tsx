import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import PickerItem, { PickerItemDate } from './PickerItem';
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
    startData: {
      type: String,
      default: '2000-01-01',
    },
    endData: {
      type: String,
      default: () => new Date().toDateString(),
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const yearList = ref<PickerItemDate[]>([]);
    const monthList = ref<PickerItemDate[]>([]);
    const dayList = ref<PickerItemDate[]>([]);

    const selectYear = ref(2000);
    const selectMonth = ref(1);
    const selectDay = ref(1);

    const startYear = new Date(props.startData).getFullYear();
    const startMonth = new Date(props.startData).getMonth() + 1;
    const startDay = new Date(props.startData).getDay();
    const endYear = new Date(props.endData).getFullYear();
    const endMonth = new Date(props.endData).getMonth() + 1;
    const endDay = new Date(props.endData).getDate();

    const monthCN = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    /**
     * 初始化年月日数组
     */
    const setDateList = () => {
      selectYear.value = startYear;
      //获取年份素组
      for (let year = startYear; year < endYear + 1; year++) {
        yearList.value.push({
          text: `${year}年`,
          key: year
        })
      }

      // 获取月份数组
      selectMonth.value = startMonth;
      monthList.value = getMonthList();

      // 获取当前月天数
      selectDay.value = startDay;
      dayList.value = getDayList();
    };

    // 获取月份数组
    const getMonthList = () => {
      let monthArrary = [];
      if (selectYear.value === startYear) {
        // 开始年获取月份
        for (let month = startMonth - 1; month < 12; month++) {
          monthArrary.push({
            text: monthCN[month],
            key: month + 1,
          });
        }
      } else if (selectYear.value === endYear) {
        // 结束年获取月份
        for (let month = 0; month < endMonth; month++) {
          monthArrary.push({
            text: monthCN[month],
            key: month + 1,
          });
        }
      } else {
        // 正常获取月份
        for (let month = 0; month < 12; month++) {
          monthArrary.push({
            text: monthCN[month],
            key: month + 1,
          });
        }
      }
      return monthArrary;
    }

    // 获取天数
    const getDayList = () => {
      let dayArrary = [];
      let dayNum = new Date(Number(selectYear.value), Number(selectMonth.value), 0);
      if (endYear === selectYear.value && endMonth === selectMonth.value) {
        for (let day = 1; day < endDay + 1; day++) {
          dayArrary.push({
            text: `${day}日`,
            key: day,
          });
        }
      } else {
        for (let day = 1; day < dayNum.getDate() + 1; day++) {
          dayArrary.push({
            text: `${day}日`,
            key: day,
          });
        }
      }
      return dayArrary;
    }

    // 更新选中年
    const updateSelectYear = (item: PickerItemDate, index: number) => {
      selectYear.value = item.key;
      monthList.value = getMonthList();
    }

    // 更新选中月
    const updateSelectMonth = (item: PickerItemDate, index: number) => {
      selectMonth.value = item.key;
      dayList.value = getDayList();
    }

    let timer: any = null;
    // 更新选中天
    const updateSelectDay = (item: PickerItemDate, index: number) => {
      selectDay.value = item.key;

      const selectData = `${selectYear.value}/${selectMonth.value}/${selectDay.value}`;
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(selectData)
        console.log(` ${new Date(selectData)}`)
        emit('change', selectData);
      }, 100);
    }

    onMounted(() => {
      setDateList();
    });

    return () => (
      <div style={{ display: 'flex', backgroundColor: '#fff', padding: '0 16px' }}>
        <PickerItem dataList={yearList.value} {...{ onUpdateSelect: updateSelectYear }} />
        <PickerItem dataList={monthList.value}  {...{ onUpdateSelect: updateSelectMonth }} />
        <PickerItem dataList={dayList.value}  {...{ onUpdateSelect: updateSelectDay }} />
      </div>
    );
  },
});
