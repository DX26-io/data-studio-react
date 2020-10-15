import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Flex, Text, View } from '@adobe/react-spectrum';
import { Avatar } from '@material-ui/core';
import HeaderPopover from 'app/shared/layout/header/partials/HeaderPopover';


const DataStudioAvatar = () => {
  // TODO review this way of overriding the styles
  const useStyles = makeStyles((theme) => ({
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4)
    }
  }));
  const classes = useStyles();
  // TODO get the user name and extract the first name
  return (
    <>
      <HeaderPopover icon={<Avatar className={classes.small}><span className='avatar-initial'>H</span></Avatar>}>
        <View padding='size-300'>
          <Flex alignItems='center' justifyContent='center' direction='column'>
            <Text marginBottom='size-200'> Hello {"userName"}</Text>
            <Divider marginY='size-200' size="S" />
            <Button isQuiet={true} variant='primary' marginBottom='size-200' >
              <Text>Preferences</Text>
            </Button>
            <Button variant="primary" justifySelf='center'>
              <Text>Sign Out</Text>
            </Button>
          </Flex>
        </View>
      </HeaderPopover>
    </>
  );
};

export default DataStudioAvatar;
