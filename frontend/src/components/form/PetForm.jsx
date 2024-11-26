import React, { useState } from "react";
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
import { ImageIcon } from "lucide-react";

function PetForm({ petData }) {
  const [pet, setPet] = useState(petData || {});
  const [preview, setPreview] = useState([]);
  const colors = ["Branco", "Preto", "Cinza", "Caramelo"];

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value });
  }

  function onFileChange(e) {
    const files = Array.from(e.target.files);
    setPet({ ...pet, images: files });
    setPreview(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    // Append all pet data to formData
    Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet.images.length; i++) {
          formData.append("images", pet.images[i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    // Add your API call here
    // Example: await api.post('/pets/create', formData)
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
                  value={pet.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade do Pet:</Label>
                <Input
                  type="text"
                  id="age"
                  name="age"
                  placeholder="Digite a idade"
                  value={pet.age || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso do Pet:</Label>
                <Input
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="Digite o peso"
                  value={pet.weight || ""}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label>Selecione a cor:</Label>
                <Select
                  onValueChange={(value) => setPet({ ...pet, color: value })}
                  value={pet.color || ""}
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
