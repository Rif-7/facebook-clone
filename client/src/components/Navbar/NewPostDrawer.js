import {
  Box,
  Button,
  Stack,
  useDisclosure,
  Drawer,
  DrawerBody,
  Image,
  Input,
  DrawerHeader,
  DrawerOverlay,
  Alert,
  AlertIcon,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';

export default function NewPostDrawer() {
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState('');

  const handleImageChange = e => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleFileInputButton = () => {
    fileInputRef.current.click();
  };

  const handleCaptionChange = e => {
    setCaption(e.target.value);
  };

  const customOnClose = () => {
    setCaption('');
    setSelectedImage(null);
    setPreviewImage(null);
    onClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log(selectedImage);
    console.log(caption);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        size={'sm'}
        rightIcon={<AddIcon />}
        colorScheme="green"
        variant="solid"
      >
        New Post
      </Button>
      <Drawer
        placement="right"
        size={'md'}
        isOpen={isOpen}
        onClose={customOnClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create A New Post</DrawerHeader>

          <DrawerBody overflowY={'auto'}>
            <Box as={'form'} mt={10} onSubmit={onSubmit}>
              <Stack spacing={4} alignItems={'center'}>
                <Input
                  placeholder="Caption"
                  onChange={handleCaptionChange}
                  value={caption}
                  bg={'gray.100'}
                  border={0}
                  color={'gray.500'}
                  _placeholder={{
                    color: 'gray.500',
                  }}
                />
                <Input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
                <Button
                  fontFamily={'heading'}
                  alignSelf={'start'}
                  bg={'gray.200'}
                  color={'gray.800'}
                  onClick={handleFileInputButton}
                >
                  Choose Image
                </Button>
                {selectedImage ? (
                  <Image
                    fallback={
                      <Alert status="error">
                        <AlertIcon />
                        There was an error while displaying the image. The image
                        will not be submitted.
                      </Alert>
                    }
                    src={previewImage}
                    alt="selected image"
                  />
                ) : null}
              </Stack>
              <Button
                fontFamily={'heading'}
                type="submit"
                mt={8}
                w={'full'}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, red.400,pink.400)',
                  boxShadow: 'xl',
                }}
              >
                Submit
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
