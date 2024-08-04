'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [inputText, setInputText] = useState('')

  const inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase()
    setInputText(lowerCase)
  }
  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 0){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return(
    <Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={2} bgcolor={'#0f111a'}>
      <Modal 
      open={open} 
      onClose={handleClose}>
        <Box 
        position={'absolute'} 
        top={'50%'} 
        left={'50%'} 
        width={400} 
        bgcolor={'white'} 
        border={'2px solid #000000'} 
        borderRadius={2}
        boxShadow={24} 
        padding={4} 
        display={'flex'} 
        flexDirection={'column'} 
        gap={3}
        sx={{
          transform: 'translate(-50%, -50%)', 
        }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width={'100%'} direction={'row'} spacing={2}>
            <TextField 
            variant="outlined" 
            fullWidth 
            value={itemName} 
            onChange={(e)=>{
              setItemName(e.target.value)
            }}/>
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box border={'5px solid #1e253b'} bgcolor={'#0f111a'} boxShadow={'0px 0px 20px #1e253b'}>
        <Box width={'85vw'} height='100px' bgcolor='#1c2336' display={'flex'} justifyContent={'space-between'} alignItems={'center'} p={5} pr={10}>
          <Typography variant="h2" color='#c1c9e3' fontFamily={'Roboto'}>Inventory Items</Typography>
      <Button variant="contained" onClick={() => {
        handleOpen()
      }}>Add New Item</Button>
        </Box>
        <Stack width='85vw' height='600px' spacing={2} overflow={'auto'} p={2}>
          {
            inventory.map(({name, quantity}) => (
              <Box key={name} width={'100%'} minHeight={'150px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderRadius={2} bgcolor={'#1c2336'} padding={5} boxShadow={'0px 0px 10px #132661'}>
                <Typography variant="h3" color={'#c1c9e3'} textAlign={'center'}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Stack direction={'row'} spacing={5}>
                  <Button variant="outlined" onClick={() => {
                    removeItem(name)
                  }}
                  sx={{
                    fontSize: 18,
                  }}
                  >-</Button>
                  <Typography variant="h3" color={'#c1c9e3'} textAlign={'center'}>{quantity}</Typography>
                  <Button variant="outlined" onClick={() => {
                    addItem(name)
                  }}
                  sx={{
                    fontSize: 15,
                  }}
                  >+</Button>
                </Stack>
                <Button variant="contained" onClick={() => {
                  window.open("https://www.google.com/search?udm=28&q=" + name, "_blank")
                }}>Buy More</Button>
              </Box>
              
            ))
          }
        </Stack>
      </Box>
    </Box>
  );
}
