import { h } from 'vue';
import { TYPE, useToast as baseToast } from 'vue-toastification';

type ToastOptions = {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function useToast() {
  const toast = baseToast();

  function showSuccess(options: string | ToastOptions) {
    if (typeof options === 'string') {
      toast.success(options);
    } else {
      // Render message + action button
      toast(
        {
          render() {
            return h('div', { class: 'flex items-center justify-between gap-2' }, [
              h('span', options.message),
              options.action
                ? h(
                    'button',
                    {
                      class: 'ml-2 text-blue-500 hover:underline focus:outline-none',
                      onClick: () => {
                        options.action?.onClick();
                        toast.clear(); // optional: clear toast after undo
                      },
                    },
                    options.action.label
                  )
                : null,
            ]);
          },
        },
        { type: TYPE.SUCCESS, timeout: 5000 }
      );
    }
  }

  return {
    success: showSuccess,
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
  };
}
