const Dispatcher = () => {
  const stores = [];
  const register = store => {
    if (!store || !store.update) {
      throw new Error('要求 store 参数，且需配备 update 方法');
    }

    let consumers = [];

    const change = () => {
      consumers.forEach(consumer => {
        consumer(store);
      });
    };

    const subscribe = (consumer, noInit = false) => {
      consumers = consumers.concat(consumer);
      !noInit ? consumer.forEach(c => c(store)) : null;
    };

    stores.push({ store, change });

    return subscribe;
  };

  const dispatch = action => {
    (stores || []).forEach(({ store, change }) => {
      store.update(action, change);
    });
  };

  return { register, dispatch };
};

const dispatcher = Dispatcher();

const createAction = type => {
  if (!type) throw new Error(`请传入 action 的 type 参数`);

  return payload => dispatcher.dispatch({ type, payload });
};

const createSubscriber = store => dispatcher.register(store);

const View = (subscribeToStore, increase, decrease) => {
  let value = null;
  const el = document.querySelector('#counter');
  const display = el.querySelector('#display');
  const [increaseBtn, decreaseBtn] = Array.from(el.querySelectorAll('.button'));
  const render = () => (display.innerHTML = value);
  const updateState = store => (value = store.getValue());

  subscribeToStore([updateState, render]);
  increaseBtn.addEventListener('click', increase);
  decreaseBtn.addEventListener('click', decrease);
};

const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

const counterStore = () => ({
  data: { value: 0 },
  getValue() {
    return this.data.value;
  },
  update(action, change) {
    switch (action.type) {
      case INCREASE:
        this.data.value += 1;
        break;
      case DECREASE:
        this.data.value -= 1;
        break;
      default:
        void null;
    }

    change();
  },
});

const counterStoreSubScriber = createSubscriber(counterStore());
const actions = {
  increase: createAction(INCREASE),
  decrease: createAction(DECREASE),
};

View(counterStoreSubScriber, actions.increase, actions.decrease);
