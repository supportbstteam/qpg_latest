import React, { useState } from 'react';
import { View, Text, TouchableOpacity ,Button} from 'react-native';



interface AgreeCheckbox {
    label:string;
    onChange:(value:boolean)=>void;
}
const AgreeCheckbox :React.FC<AgreeCheckbox>= ({ label, onChange }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <TouchableOpacity onPress={handleCheckboxChange} style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20 }}>
      <View
        style={{
          width: 22,
          height: 23,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: isChecked ? 'green' : 'gray',
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isChecked && <Text style={{color:"#000"}}>✓</Text>}
      </View>
      <Text style={{color:"#000"}}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AgreeCheckbox;
