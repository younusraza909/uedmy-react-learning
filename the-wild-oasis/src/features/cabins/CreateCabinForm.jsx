import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import { createEditCabin } from '../../services/apiCabins';

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: cabinToEditId, ...cabinToEditValue } = cabinToEdit;

  const isEditForm = Boolean(cabinToEditId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditForm ? cabinToEditValue : {},
  });
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate: createCabinHandler, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: editCabinHandler, isLoading: isEditing } = useMutation({
    mutationFn: ({ data, id }) => createEditCabin(data, id),
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    const isImageChanged = typeof data.image === 'string';

    isEditForm
      ? editCabinHandler({
          data: {
            ...data,
            image: isImageChanged ? data.image : data?.image[0],
          },
          id: cabinToEditId,
        })
      : createCabinHandler({ ...data, image: data.image[0] });
  }

  const isWorking = isCreating || isEditing;

  function onError(errors) {
    console.log(errors);
  }

  return (
    // the react form hoook will call onSubmit if any error found than it will call onError function
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isWorking}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          disabled={isWorking}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              +value <= getValues().regularPrice ||
              'Discount should be less than regular price',
          })}
        />
      </FormRow>

      <FormRow
        label='Description for website'
        disabled={isWorking}
        error={errors?.description?.message}
      >
        <Textarea
          type='number'
          id='description'
          defaultValue=''
          disabled={isWorking}
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow
        label='Cabin photo'
        disabled={isWorking}
        error={errors?.image?.message}
      >
        <FileInput
          id='image'
          accept='image/*'
          {...register('image', {
            required: isEditForm ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditForm ? 'Edit Cabin' : 'Add Cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
