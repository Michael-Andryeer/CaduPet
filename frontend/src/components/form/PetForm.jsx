import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ImageIcon } from 'lucide-react';
import useFlashMessage from "../../hooks/useFlashMessage";
import api from "../../utils/api";

function PetForm({ petData }) {
  const [pet, setPet] = useState(petData || {
    name: '',
    age: '',
    weight: '',
    color: '',
    images: []
  });
  const [preview, setPreview] = useState([]);
  const colors = ["Branco", "Preto", "Cinza", "Caramelo"];
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    
    if (name === 'weight') {
      // Ensure weight is always a valid number or empty string
      const numValue = value === '' ? '' : parseFloat(value);
      setPet(prev => ({ ...prev, [name]: numValue }));
    } else {
      setPet(prev => ({ ...prev, [name]: value }));
    }
  }

  function onFileChange(e) {
    const files = Array.from(e.target.files);
    setPet(prev => ({ ...prev, images: files }));
    setPreview(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Stricter validations
    if (!pet.name?.trim()) {
      setFlashMessage('Nome é obrigatório', 'error');
      return;
    }

    if (!pet.age?.trim()) {
      setFlashMessage('Idade é obrigatória', 'error');
      return;
    }

    if (!pet.weight || isNaN(Number(pet.weight)) || Number(pet.weight) <= 0) {
      setFlashMessage('Por favor, insira um peso válido maior que 0', 'error');
      return;
    }

    if (!pet.color) {
      setFlashMessage('Cor é obrigatória', 'error');
      return;
    }

    if (!pet.images?.length) {
      setFlashMessage('Pelo menos uma imagem é obrigatória', 'error');
      return;
    }

    const formData = new FormData();

    // Ensure all fields are strings in FormData
    formData.append('name', pet.name.trim());
    formData.append('age', pet.age.trim());
    formData.append('weight', pet.weight.toString());
    formData.append('color', pet.color);

    // Add images
    pet.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await api.post('pets/create', formData, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFlashMessage(response.data.message, 'success');
      navigate('/pets/mypets');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao cadastrar pet';
      setFlashMessage(errorMessage, 'error');
      console.error('Error details:', error.response?.data);
    }
  }

  return (
    <section className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Cadastre um Pet</CardTitle>
          <CardDescription className="text-center">
            Depois ele ficará disponível para adoção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-4">
                {preview.length > 0 ? (
                  preview.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="images" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span>Imagens do Pet:</span>
                    <Input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={onFileChange}
                      className="max-w-[230px]"
                      required
                    />
                  </div>
                </Label>
              </div>
            </div>

            {/* Pet Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pet:</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Digite o nome"
                  value={pet.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade do Pet:</Label>
                <Input
                  type="text"
                  id="age"
                  name="age"
                  placeholder="Digite a idade"
                  value={pet.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso do Pet (kg):</Label>
                <Input
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="Digite o peso em kg"
                  value={pet.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Selecione a cor:</Label>
                <Select
                  onValueChange={(value) => setPet(prev => ({ ...prev, color: value }))}
                  value={pet.color}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
              Cadastrar Pet
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
export default PetForm;

